"""Farmer view of orders that include their products."""

from datetime import datetime
from decimal import Decimal
from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_farmer_user
from app.db.session import get_db
from app.models.order import Order, OrderItem
from app.models.user import User

router = APIRouter(prefix="/seller/orders", tags=["Seller orders"])


class SellerOrderItem(BaseModel):
    id: int
    product_id: Optional[int] = None
    product_name: str
    unit_price: Decimal
    quantity: int
    line_total: Decimal

    model_config = {"from_attributes": True}


class SellerOrderResponse(BaseModel):
    order_id: int
    status: str
    payment_method: Optional[str] = None
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    shipping_email: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    my_items: List[SellerOrderItem]
    my_subtotal: Decimal


@router.get("", response_model=List[SellerOrderResponse])
def list_seller_orders(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_farmer_user)],
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    """Orders that contain at least one line item sold by this farmer."""
    # Find order ids that have this seller's items
    order_ids = (
        db.query(OrderItem.order_id)
        .filter(OrderItem.seller_id == current_user.id)
        .distinct()
        .order_by(OrderItem.order_id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    ids = [row[0] for row in order_ids]
    if not ids:
        return []

    orders = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id.in_(ids))
        .order_by(Order.id.desc())
        .all()
    )

    out: List[SellerOrderResponse] = []
    for order in orders:
        mine = [i for i in order.items if i.seller_id == current_user.id]
        if not mine:
            continue
        subtotal = sum((i.line_total for i in mine), Decimal("0.00"))
        out.append(
            SellerOrderResponse(
                order_id=order.id,
                status=order.status,
                payment_method=order.payment_method,
                shipping_name=order.shipping_name,
                shipping_phone=order.shipping_phone,
                shipping_address=order.shipping_address,
                shipping_email=order.shipping_email,
                notes=order.notes,
                created_at=order.created_at,
                my_items=[
                    SellerOrderItem(
                        id=i.id,
                        product_id=i.product_id,
                        product_name=i.product_name,
                        unit_price=i.unit_price,
                        quantity=i.quantity,
                        line_total=i.line_total,
                    )
                    for i in mine
                ],
                my_subtotal=subtotal.quantize(Decimal("0.01")),
            )
        )
    return out
