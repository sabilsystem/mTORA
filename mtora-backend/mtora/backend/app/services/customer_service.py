from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import EntityNotFoundError
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate


def get_customers(db: Session, skip: int = 0, limit: int = 100) -> List[Customer]:
    """Retrieve list of customers with pagination."""
    stmt = select(Customer).offset(skip).limit(limit).order_by(Customer.id.asc())
    return list(db.execute(stmt).scalars().all())


def get_customer_by_id(db: Session, customer_id: int) -> Optional[Customer]:
    """Retrieve single customer by id."""
    stmt = select(Customer).where(Customer.id == customer_id)
    return db.execute(stmt).scalar_one_or_none()


def create_customer(db: Session, customer_in: CustomerCreate) -> Customer:
    """Create a new customer."""
    customer = Customer(
        name=customer_in.name,
        mobile_no=customer_in.mobile_no,
        whatsapp_no=customer_in.whatsapp_no,
        address=customer_in.address,
        location=customer_in.location,
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def update_customer(db: Session, customer_id: int, customer_in: CustomerUpdate) -> Customer:
    """Update customer details."""
    customer = get_customer_by_id(db, customer_id)
    if not customer:
        raise EntityNotFoundError("Customer", customer_id)

    update_data = customer_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(customer, field, value)

    db.commit()
    db.refresh(customer)
    return customer
