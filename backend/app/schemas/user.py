from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=30)
    password: str = Field(..., min_length=6, max_length=128)
    # Optional farmer signup fields (task 2 will use /sell register path)
    role: Optional[str] = Field(None, pattern="^(customer|farmer)$")
    farm_name: Optional[str] = Field(None, max_length=200)
    county: Optional[str] = Field(None, max_length=100)
    farm_location: Optional[str] = Field(None, max_length=255)
    goods_to_sell: Optional[str] = Field(None, max_length=1000)
    mpesa_number: Optional[str] = Field(None, max_length=30)
    accepted_terms: bool = False


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None
    is_active: bool
    is_admin: bool
    role: str = "customer"
    farm_name: Optional[str] = None
    county: Optional[str] = None
    farm_location: Optional[str] = None
    goods_to_sell: Optional[str] = None
    mpesa_number: Optional[str] = None
    seller_active: bool = True
    created_at: datetime

    model_config = {"from_attributes": True}


class UserProfileUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=120)
    phone: Optional[str] = Field(None, max_length=30)
    farm_name: Optional[str] = Field(None, max_length=200)
    county: Optional[str] = Field(None, max_length=100)
    farm_location: Optional[str] = Field(None, max_length=255)
    goods_to_sell: Optional[str] = Field(None, max_length=1000)
    mpesa_number: Optional[str] = Field(None, max_length=30)


class MessageResponse(BaseModel):
    message: str
