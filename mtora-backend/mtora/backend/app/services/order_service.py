from datetime import datetime, timezone
from decimal import Decimal
from typing import List, Optional, Union
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.exceptions import BusinessValidationError, EntityNotFoundError
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.pack import Pack
from app.schemas.order import OrderCreate, OrderUpdate


def generate_order_id() -> str:
    """Generate a unique business-facing order identifier."""
    date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
    suffix = uuid.uuid4().hex[:6].upper()
    return f"ORD-{date_str}-{suffix}"


def get_orders(db: Session, skip: int = 0, limit: int = 100) -> List[Order]:
    """Retrieve list of orders with eagerly loaded customer and items."""
    stmt = (
        select(Order)
        .options(
            joinedload(Order.customer),
            joinedload(Order.items).joinedload(OrderItem.pack),
        )
        .order_by(Order.id.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.execute(stmt).unique().scalars().all())


def get_order_by_identifier(db: Session, identifier: Union[int, str]) -> Optional[Order]:
    """
    Retrieve order by either database integer ID or unique business order_id string.
    Eagerly loads items, packs, and customer.
    """
    # Check by primary key if integer or numeric string
    if isinstance(identifier, int) or (isinstance(identifier, str) and identifier.isdigit()):
        stmt = (
            select(Order)
            .options(
                joinedload(Order.customer),
                joinedload(Order.items).joinedload(OrderItem.pack),
            )
            .where(Order.id == int(identifier))
        )
        order = db.execute(stmt).unique().scalar_one_or_none()
        if order:
            return order

    # Check by business order_id string
    stmt = (
        select(Order)
        .options(
            joinedload(Order.customer),
            joinedload(Order.items).joinedload(OrderItem.pack),
        )
        .where(Order.order_id == str(identifier))
    )
    return db.execute(stmt).unique().scalar_one_or_none()


def create_order(db: Session, order_in: OrderCreate) -> Order:
    """
    Create a new order transactionally:
    1. Validate customer exists.
    2. Validate items are provided.
    3. Validate every pack exists.
    4. Retrieve current selling price from database for each pack.
    5. Calculate item subtotals and total amount using Decimal.
    6. Store actual unit_price at time of order creation.
    7. Commit order and items in a single atomic transaction.
    """
    # 1. Validate customer
    customer = db.execute(
        select(Customer).where(Customer.id == order_in.customer_id)
    ).scalar_one_or_none()
    if not customer:
        raise EntityNotFoundError("Customer", order_in.customer_id)

    # 2. Validate items non-empty
    if not order_in.items:
        raise BusinessValidationError("Order must contain at least one item")

    # Determine order_id
    if order_in.order_id:
        existing = db.execute(
            select(Order).where(Order.order_id == order_in.order_id)
        ).scalar_one_or_none()
        if existing:
            raise BusinessValidationError(
                f"Order with order_id '{order_in.order_id}' already exists"
            )
        business_order_id = order_in.order_id
    else:
        business_order_id = generate_order_id()

    # 3 & 4. Validate packs and calculate total
    total_amount = Decimal("0.00")
    order_items_to_create: List[OrderItem] = []

    for item in order_in.items:
        pack = db.execute(
            select(Pack).where(Pack.id == item.pack_id)
        ).scalar_one_or_none()
        if not pack:
            raise EntityNotFoundError("Pack", item.pack_id)

        # Snapshot current selling price
        unit_price = Decimal(str(pack.selling_price))
        item_quantity = Decimal(item.quantity)
        subtotal = item_quantity * unit_price
        total_amount += subtotal

        order_item = OrderItem(
            pack_id=pack.id,
            quantity=item.quantity,
            unit_price=unit_price,
        )
        order_items_to_create.append(order_item)

    # 5. Create Order
    order = Order(
        order_id=business_order_id,
        customer_id=customer.id,
        payment_mode=order_in.payment_mode,
        notes=order_in.notes,
        total_amount=total_amount,
        order_status="pending",
        payment_status="pending",
        delivery_status="pending",
        delivery_slot=order_in.delivery_slot,
        delivery_day=order_in.delivery_day,
        items=order_items_to_create,
    )

    db.add(order)
    db.commit()

    # Reload with relationships
    return get_order_by_identifier(db, order.id)  # type: ignore[return-value]


def update_order(
    db: Session, identifier: Union[int, str], order_in: OrderUpdate
) -> Order:
    """Update order status or metadata."""
    order = get_order_by_identifier(db, identifier)
    if not order:
        raise EntityNotFoundError("Order", identifier)

    update_data = order_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(order, field, value)

    db.commit()
    db.refresh(order)
    return get_order_by_identifier(db, order.id)  # type: ignore[return-value]
