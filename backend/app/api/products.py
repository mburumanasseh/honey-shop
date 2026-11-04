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
    """
    Public shop visibility:
    - Product must be active (is_active)
    - Platform products (seller_id is null) are visible
    - Farmer products are visible when the farmer is verified & seller_active

    Product approval_status is not required for public display once the seller
    is verified; admins can still hide a product via is_active.
    """
    inactive_seller_ids = (
        db.query(User.id)
        .filter(User.role == "farmer", User.seller_active.is_(False))
        .subquery()
    )
    return (
        db.query(Product)
        .filter(Product.is_active.is_(True))
        .filter(
            (Product.seller_id.is_(None))
            | (~Product.seller_id.in_(inactive_seller_ids))
        )
    )


def _is_publicly_visible(db: Session, product: Product) -> bool:
    if not product.is_active:
        return False
    if product.seller_id is None:
        return True
    seller = db.get(User, product.seller_id)
    if seller is None:
        return False
    if seller.role == "farmer" and not seller.seller_active:
        return False
    return True


@router.get("", response_model=list[ProductResponse])
def list_products(
    db: Annotated[Session, Depends(get_db)],
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    include_inactive: bool = Query(False),
    category: Optional[str] = Query(None),
    seller_id: Optional[int] = Query(None),
):
    """List products. Public shop: active listings from platform or verified farmers."""
    if include_inactive:
        query = db.query(Product)
    else:
        query = _public_visible_query(db)

    if category:
        cat = category.strip().lower()
        query = query.filter(Product.category == cat)
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

    if not _is_publicly_visible(db, product):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_admin_user)],
):
    product = Product(
        name=payload.name,
        description=payload.description,
        price=payload.price,
        size=payload.size,
        image_url=payload.image_url,
        stock=payload.stock if payload.stock is not None else 0,
        is_active=payload.is_active if payload.is_active is not None else True,
        seller_id=None,
        category=payload.category or "honey",
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
    """Permanently delete a product from the database."""
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(product)
    db.commit()
    return None
