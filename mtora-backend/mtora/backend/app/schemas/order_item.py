from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.pack import PackResponse


class OrderItemCreate(BaseModel):
    pack_id: int = Field(..., gt=0, description="Database ID of the pack")
    quantity: int = Field(..., gt=0, description="Quantity of packs ordered")


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    pack_id: int
    quantity: int
    unit_price: Decimal
    pack: Optional[PackResponse] = None

    model_config = ConfigDict(from_attributes=True)
