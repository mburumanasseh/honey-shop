from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base

# Roles: customer | farmer | admin
ROLE_CUSTOMER = "customer"
ROLE_FARMER = "farmer"
ROLE_ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    # Marketplace role (customer / farmer / admin). is_admin kept for compatibility.
    role: Mapped[str] = mapped_column(String(20), default=ROLE_CUSTOMER, nullable=False)
    # Farmer profile (used when role == farmer)
    farm_name: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    county: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    # More specific place (market, village, ward, etc.)
    farm_location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    # What they plan to sell (e.g. honey, milk, eggs)
    goods_to_sell: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    mpesa_number: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    # When False, farmer may log in but cannot create listings; their products are hidden.
    seller_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    @property
    def is_farmer(self) -> bool:
        return self.role == ROLE_FARMER

    @property
    def can_list_products(self) -> bool:
        """Farmers may list only when seller_active; admins always can."""
        if self.is_admin or self.role == ROLE_ADMIN:
            return True
        return self.role == ROLE_FARMER and self.seller_active
