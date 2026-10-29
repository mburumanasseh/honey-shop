from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user
from app.db.session import get_db
from app.models.product import (
    APPROVAL_APPROVED,
    APPROVAL_PENDING,
    Product,
)
from app.models.user import User
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(prefix="/products", tags=["Products"])


def _public_visible_query(db: Session):
    """Active + approved products whose seller is active (or platform-owned)."""
    q = db.query(Product).filter(
        Product.is_active.is_(True),
        Product.approval_status == APPROVAL_APPROVED,
    )
    # Exclude products from deactivated sellers (seller_active = false)
    inactive_seller_ids = (
        db.query(User.id)
        .filter(User.role == "farmer", User.seller_active.is_(False))
        .subquery()
    )
    q = q.filter(
        (Product.seller_id.is_(None)) | (~Product.seller_id.in_(inactive_seller_ids))
    )
    return q


@router.get("", response_model=list[ProductResponse])
def list_products(
    db: Annotated[Session, Depends(get_db)],
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    include_inactive: bool = Query(False),
    category: Optional[str] = Query(None),
    seller_id: Optional[int] = Query(None),
):
    """List products. Public shop: only active, approved, seller-active listings."""
    if include_inactive:
        # Admin-style listing (auth checked by admin routes later if needed)
        query = db.query(Product)
    else:
        query = _public_visible_query(db)

    if category:
        query = query.filter(Product.category == category)
    if seller_id is not None:
        query = query.filter(Product.seller_id == seller_id)

    products = query.order_by(Product.id).offset(skip).limit(min(limit, 100)).all()
    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Annotated[Session, Depends(get_db)],
):
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    # Public detail: same visibility rules
    if not product.is_active or product.approval_status != APPROVAL_APPROVED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    if product.seller_id is not None:
        seller = db.get(User, product.seller_id)
        if seller is not None and seller.role == "farmer" and not seller.seller_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
            )

    return product


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_admin_user)],
):
    """Admin creates platform (Mercy Gold) products — auto-approved."""
    product = Product(
        name=payload.name,
        description=payload.description,
        price=payload.price,
        size=payload.size,
        image_url=payload.image_url,
        stock=payload.stock,
        is_active=payload.is_active,
        category=payload.category or "honey",
        seller_id=None,
        approval_status=APPROVAL_APPROVED,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_admin_user)],
):
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_admin_user)],
):
    """Permanently delete a product from the database.

    Historical order line items keep product_name / price snapshots;
    order_items.product_id is set to NULL via ON DELETE SET NULL.
    """
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(product)
    db.commit()
    return None
