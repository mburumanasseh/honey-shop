"""Farmer (seller) product CRUD — listings require admin approval."""

from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_farmer_user, require_seller_can_list
from app.db.session import get_db
from app.models.product import APPROVAL_PENDING, Product
from app.models.user import User
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(prefix="/seller/products", tags=["Seller products"])


@router.get("", response_model=list[ProductResponse])
def list_my_products(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_farmer_user)],
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    """List all products owned by the current farmer (any approval status)."""
    if current_user.is_admin or current_user.role == "admin":
        # Admins see platform products (seller_id is null) in this endpoint only if needed;
        # farmers only see their own.
        query = db.query(Product).filter(Product.seller_id == current_user.id)
    else:
        query = db.query(Product).filter(Product.seller_id == current_user.id)

    return query.order_by(Product.id.desc()).offset(skip).limit(limit).all()


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_my_product(
    payload: ProductCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_seller_can_list)],
):
    """Create a product as pending until Mercy Gold approves it."""
    product = Product(
        name=payload.name.strip(),
        description=payload.description,
        price=payload.price,
        size=payload.size,
        image_url=payload.image_url,
        stock=payload.stock,
        is_active=True,
        category=(payload.category or "honey").strip().lower(),
        seller_id=current_user.id,
        approval_status=APPROVAL_PENDING,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/{product_id}", response_model=ProductResponse)
def get_my_product(
    product_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_farmer_user)],
):
    product = db.get(Product, product_id)
    if product is None or product.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.patch("/{product_id}", response_model=ProductResponse)
def update_my_product(
    product_id: int,
    payload: ProductUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_farmer_user)],
):
    """Farmers may edit their own products. Material changes reset approval to pending."""
    product = db.get(Product, product_id)
    if product is None or product.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    # Inactive sellers may update stock/description of existing items but not "publish" new ones
    data = payload.model_dump(exclude_unset=True)
    # Farmers cannot self-approve
    data.pop("approval_status", None)

    material_fields = {"name", "description", "price", "size", "image_url", "category"}
    if material_fields.intersection(data.keys()):
        product.approval_status = APPROVAL_PENDING

    for field, value in data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_product(
    product_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_farmer_user)],
):
    product = db.get(Product, product_id)
    if product is None or product.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(product)
    db.commit()
    return None
