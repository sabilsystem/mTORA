from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class PackResponse(BaseModel):
    id: int
    code: str
    name: str
    regular_price: Decimal
    selling_price: Decimal
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
