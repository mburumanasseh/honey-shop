"""Marketplace: user roles, farmer fields, product seller + approval

Revision ID: 010
Revises: 009
Create Date: 2026-10-29

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "010"
down_revision: Union[str, None] = "009"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- users ---
    op.add_column(
        "users",
        sa.Column("role", sa.String(length=20), nullable=False, server_default="customer"),
    )
    op.add_column(
        "users",
        sa.Column("farm_name", sa.String(length=200), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("county", sa.String(length=100), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("mpesa_number", sa.String(length=30), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column(
            "seller_active",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )
    # Backfill: existing admins get role=admin
    op.execute("UPDATE users SET role = 'admin' WHERE is_admin = true")

    # --- products ---
    op.add_column(
        "products",
        sa.Column("seller_id", sa.Integer(), nullable=True),
    )
    op.add_column(
        "products",
        sa.Column(
            "category",
            sa.String(length=50),
            nullable=False,
            server_default="honey",
        ),
    )
    op.add_column(
        "products",
        sa.Column(
            "approval_status",
            sa.String(length=20),
            nullable=False,
            server_default="approved",
        ),
    )
    op.create_index("ix_products_seller_id", "products", ["seller_id"])
    op.create_index("ix_products_category", "products", ["category"])
    op.create_index("ix_products_approval_status", "products", ["approval_status"])
    op.create_foreign_key(
        "products_seller_id_fkey",
        "products",
        "users",
        ["seller_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("products_seller_id_fkey", "products", type_="foreignkey")
    op.drop_index("ix_products_approval_status", table_name="products")
    op.drop_index("ix_products_category", table_name="products")
    op.drop_index("ix_products_seller_id", table_name="products")
    op.drop_column("products", "approval_status")
    op.drop_column("products", "category")
    op.drop_column("products", "seller_id")

    op.drop_column("users", "seller_active")
    op.drop_column("users", "mpesa_number")
    op.drop_column("users", "county")
    op.drop_column("users", "farm_name")
    op.drop_column("users", "role")
