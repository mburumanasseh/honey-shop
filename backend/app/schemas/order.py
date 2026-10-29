from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


ALLOWED_STATUSES = {
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
}

ALLOWED_PAYMENT_METHODS = {
    "cash",
    "mpesa",
    "other",
}

ALLOWED_PAYOUT_STATUSES = {
    "none",
    "ready",
    "paid",
}


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., ge=1)


class OrderCreate(BaseModel):
    items: List[OrderItemCreate] = Field(..., min_length=1)
    shipping_name: str = Field(..., min_length=2, max_length=120)
    shipping_phone: str = Field(..., min_length=7, max_length=30)
    shipping_address: str = Field(..., min_length=5)
    shipping_email: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: int
    product_id: Optional[int] = None
    product_name: str
    seller_id: Optional[int] = None
    unit_price: Decimal
    quantity: int
    line_total: Decimal

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    status: str
    total_amount: Decimal
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    shipping_email: Optional[str] = None
    payment_method: Optional[str] = None
    payout_status: str = "none"
    notes: Optional[str] = None
    items: List[OrderItemResponse]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class OrderStatusUpdate(BaseModel):
    """Admin can update fulfillment status, payment method, and payout readiness."""

    status: Optional[str] = None
    payment_method: Optional[str] = None
    payout_status: Optional[str] = None  # none | ready | paid


class OrderLookupRequest(BaseModel):
    """Guest order lookup by order number + shipping phone."""

    order_id: int = Field(..., ge=1)
    phone: str = Field(..., min_length=7, max_length=30)


class BootstrapAdminRequest(BaseModel):
    email: str
    secret: str
