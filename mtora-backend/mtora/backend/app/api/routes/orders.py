from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.exceptions import BusinessValidationError, EntityNotFoundError
from app.db.session import get_db
from app.schemas.order import OrderCreate, OrderResponse, OrderUpdate
from app.services import order_service

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("", response_model=List[OrderResponse])
def read_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> List[OrderResponse]:
    """Retrieve list of orders with pagination."""
    return order_service.get_orders(db, skip=skip, limit=limit)


@router.get("/{order_id}", response_model=OrderResponse)
def read_order(
    order_id: str,
    db: Session = Depends(get_db),
) -> OrderResponse:
    """Retrieve an order by its database ID or unique business order_id."""
    order = order_service.get_order_by_identifier(db, identifier=order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{order_id}' not found",
        )
    return order


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_new_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
) -> OrderResponse:
    """Create a new order transactionally with multiple order items."""
    try:
        return order_service.create_order(db, order_in=order_in)
    except EntityNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except BusinessValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.put("/{order_id}", response_model=OrderResponse)
def update_existing_order(
    order_id: str,
    order_in: OrderUpdate,
    db: Session = Depends(get_db),
) -> OrderResponse:
    """Update order status or metadata."""
    try:
        return order_service.update_order(db, identifier=order_id, order_in=order_in)
    except EntityNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except BusinessValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
