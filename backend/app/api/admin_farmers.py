"""Admin: list farmers, activate/deactivate seller accounts."""

from datetime import datetime
from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user
from app.db.session import get_db
from app.models.product import Product
from app.models.user import ROLE_FARMER, User

router = APIRouter(prefix="/admin/farmers", tags=["Admin Farmers"])


class FarmerListItem(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None
    farm_name: Optional[str] = None
    county: Optional[str] = None
    mpesa_number: Optional[str] = None
    seller_active: bool
    is_active: bool
    products_count: int
    pending_count: int
    created_at: str

    model_config = {"from_attributes": True}


class SellerActiveUpdate(BaseModel):
    seller_active: bool


@router.get("", response_model=List[FarmerListItem])
def list_farmers(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_admin_user)],
    skip: int = 0,
    limit: int = 100,
):
    farmers = (
        db.query(User)
        .filter(User.role == ROLE_FARMER)
        .order_by(User.id.desc())
        .offset(skip)
        .limit(min(limit, 200))
        .all()
    )

    out: List[FarmerListItem] = []
    for user in farmers:
        products_count = (
            db.query(func.count(Product.id))
            .filter(Product.seller_id == user.id)
            .scalar()
            or 0
        )
        pending_count = (
            db.query(func.count(Product.id))
            .filter(
                Product.seller_id == user.id,
                Product.approval_status == "pending",
            )
            .scalar()
            or 0
        )
        out.append(
            FarmerListItem(
                id=user.id,
                name=user.name,
                email=user.email,
                phone=user.phone,
                farm_name=user.farm_name,
                county=user.county,
                mpesa_number=user.mpesa_number,
                seller_active=user.seller_active,
                is_active=user.is_active,
                products_count=int(products_count),
                pending_count=int(pending_count),
                created_at=user.created_at.isoformat() if user.created_at else "",
            )
        )
    return out


@router.patch("/{farmer_id}/seller-active", response_model=FarmerListItem)
def set_seller_active(
    farmer_id: int,
    payload: SellerActiveUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_admin_user)],
):
    """Activate or deactivate a farmer's ability to list (and hide products when off)."""
    user = db.get(User, farmer_id)
    if user is None or user.role != ROLE_FARMER:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer not found")

    user.seller_active = payload.seller_active
    db.commit()
    db.refresh(user)

    products_count = (
        db.query(func.count(Product.id)).filter(Product.seller_id == user.id).scalar() or 0
    )
    pending_count = (
        db.query(func.count(Product.id))
        .filter(Product.seller_id == user.id, Product.approval_status == "pending")
        .scalar()
        or 0
    )

    return FarmerListItem(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        farm_name=user.farm_name,
        county=user.county,
        mpesa_number=user.mpesa_number,
        seller_active=user.seller_active,
        is_active=user.is_active,
        products_count=int(products_count),
        pending_count=int(pending_count),
        created_at=user.created_at.isoformat() if user.created_at else "",
    )
