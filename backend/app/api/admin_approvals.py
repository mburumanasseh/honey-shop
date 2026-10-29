"""Admin: review farmer products (approve / reject)."""

from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user
from app.db.session import get_db
from app.models.product import (
    APPROVAL_APPROVED,
    APPROVAL_PENDING,
    APPROVAL_REJECTED,
    Product,
)
from app.models.user import User
from app.schemas.product import ProductResponse

router = APIRouter(prefix="/admin/product-approvals", tags=["Admin Product Approvals"])


class ProductApprovalItem(ProductResponse):
    seller_name: Optional[str] = None
    seller_email: Optional[str] = None
    farm_name: Optional[str] = None


class ApprovalDecision(BaseModel):
    approval_status: str = Field(..., pattern="^(approved|rejected|pending)$")


@router.get("", response_model=List[ProductApprovalItem])
def list_for_approval(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_admin_user)],
    status_filter: Optional[str] = Query(
        "pending", alias="status", description="pending|approved|rejected|all"
    ),
    skip: int = 0,
    limit: int = 100,
):
    q = db.query(Product).filter(Product.seller_id.isnot(None))
    if status_filter and status_filter != "all":
        q = q.filter(Product.approval_status == status_filter)

    products = q.order_by(Product.id.desc()).offset(skip).limit(min(limit, 200)).all()
    seller_ids = {p.seller_id for p in products if p.seller_id}
    sellers = {}
    if seller_ids:
        for u in db.query(User).filter(User.id.in_(seller_ids)).all():
            sellers[u.id] = u

    out: List[ProductApprovalItem] = []
    for p in products:
        s = sellers.get(p.seller_id) if p.seller_id else None
        out.append(
            ProductApprovalItem(
                id=p.id,
                name=p.name,
                description=p.description,
                price=p.price,
                size=p.size,
                image_url=p.image_url,
                stock=p.stock,
                is_active=p.is_active,
                seller_id=p.seller_id,
                category=p.category,
                approval_status=p.approval_status,
                created_at=p.created_at,
                updated_at=p.updated_at,
                seller_name=s.name if s else None,
                seller_email=s.email if s else None,
                farm_name=s.farm_name if s else None,
            )
        )
    return out


@router.patch("/{product_id}", response_model=ProductApprovalItem)
def decide_approval(
    product_id: int,
    payload: ApprovalDecision,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_admin_user)],
):
    product = db.get(Product, product_id)
    if product is None or product.seller_id is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer product not found",
        )

    product.approval_status = payload.approval_status
    if payload.approval_status == APPROVAL_APPROVED:
        product.is_active = True
    db.commit()
    db.refresh(product)

    seller = db.get(User, product.seller_id) if product.seller_id else None
    return ProductApprovalItem(
        id=product.id,
        name=product.name,
        description=product.description,
        price=product.price,
        size=product.size,
        image_url=product.image_url,
        stock=product.stock,
        is_active=product.is_active,
        seller_id=product.seller_id,
        category=product.category,
        approval_status=product.approval_status,
        created_at=product.created_at,
        updated_at=product.updated_at,
        seller_name=seller.name if seller else None,
        seller_email=seller.email if seller else None,
        farm_name=seller.farm_name if seller else None,
    )
