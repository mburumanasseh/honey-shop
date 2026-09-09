from typing import Optional

from pydantic import BaseModel, Field


class StoreSettingsUpdate(BaseModel):
    store_name: Optional[str] = Field(None, min_length=1, max_length=200)
    email: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    currency: Optional[str] = Field(None, max_length=10)
    address: Optional[str] = None


class StoreSettingsResponse(BaseModel):
    store_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    currency: str
    address: Optional[str] = None

    model_config = {"from_attributes": True}
