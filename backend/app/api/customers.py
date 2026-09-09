from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user
from app.db.session import get_db
from app.models.order import Order
from app.models.user import User

router = APIRouter(prefix="/admin/customers", tags=["Admin Customers"])


class CustomerListItem(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None
    is_active: bool
    is_admin: bool
    orders_count: int
    total_spent: float
    created_at: str

    model_config = {"from_attributes": True}


@router.get("", response_model=List[CustomerListItem])
def list_customers(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_admin_user)],
    skip: int = 0,
    limit: int = 100,
):
    """List registered users with order stats (admin only)."""
    # Aggregate paid/completed-style totals: sum all non-cancelled orders
    spend_subq = (
        db.query(
            Order.user_id.label("user_id"),
            func.count(Order.id).label("orders_count"),
            func.coalesce(func.sum(Order.total_amount), 0).label("total_spent"),
        )
        .filter(Order.status != "cancelled")
        .group_by(Order.user_id)
        .subquery()
    )

    rows = (
        db.query(
            User,
            func.coalesce(spend_subq.c.orders_count, 0),
            func.coalesce(spend_subq.c.total_spent, 0),
        )
        .outerjoin(spend_subq, User.id == spend_subq.c.user_id)
        .order_by(User.id.desc())
        .offset(skip)
        .limit(min(limit, 200))
        .all()
    )

    result: List[CustomerListItem] = []
    for user, orders_count, total_spent in rows:
        result.append(
            CustomerListItem(
                id=user.id,
                name=user.name,
                email=user.email,
                phone=user.phone,
                is_active=user.is_active,
                is_admin=user.is_admin,
                orders_count=int(orders_count or 0),
                total_spent=float(total_spent or 0),
                created_at=user.created_at.isoformat() if user.created_at else "",
            )
        )
    return result
