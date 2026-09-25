from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class CustomerBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Customer name")
    mobile_no: str = Field(..., min_length=1, max_length=50, description="Customer mobile number as text")
    whatsapp_no: Optional[str] = Field(None, max_length=50, description="Customer WhatsApp number as text")
    address: Optional[str] = Field(None, description="Delivery address")
    location: Optional[str] = Field(None, max_length=255, description="Customer location or area")


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    mobile_no: Optional[str] = Field(None, min_length=1, max_length=50)
    whatsapp_no: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = None
    location: Optional[str] = Field(None, max_length=255)


class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
