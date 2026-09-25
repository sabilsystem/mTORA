from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.customer import CustomerResponse
from app.schemas.order_item import OrderItemCreate, OrderItemResponse


class OrderCreate(BaseModel):
    customer_id: int = Field(..., gt=0, description="Database ID of the customer")
    order_id: Optional[str] = Field(
        None, max_length=100, description="Optional custom order ID; auto-generated if omitted"
    )
    payment_mode: Optional[str] = Field(None, max_length=50)
    notes: Optional[str] = None
    delivery_slot: Optional[str] = Field(None, max_length=100)
    delivery_day: Optional[str] = Field(None, max_length=50)
    items: List[OrderItemCreate] = Field(
        ..., min_length=1, description="List of pack items included in the order"
    )


class OrderUpdate(BaseModel):
    order_status: Optional[str] = Field(None, max_length=50)
    payment_status: Optional[str] = Field(None, max_length=50)
    delivery_status: Optional[str] = Field(None, max_length=50)
    payment_mode: Optional[str] = Field(None, max_length=50)
    notes: Optional[str] = None
    delivery_slot: Optional[str] = Field(None, max_length=100)
    delivery_day: Optional[str] = Field(None, max_length=50)


class OrderResponse(BaseModel):
    id: int
    order_id: str
    customer_id: int
    payment_mode: Optional[str] = None
    notes: Optional[str] = None
    total_amount: Decimal
    order_status: str
    payment_status: str
    delivery_status: str
    delivery_slot: Optional[str] = None
    delivery_day: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    customer: Optional[CustomerResponse] = None
    items: List[OrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
