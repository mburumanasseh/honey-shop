"""Add seller_id to order_items for farmer order visibility

Revision ID: 011
Revises: 010
Create Date: 2026-10-29

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "011"
down_revision: Union[str, None] = "010"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "order_items",
        sa.Column("seller_id", sa.Integer(), nullable=True),
    )
    op.create_index("ix_order_items_seller_id", "order_items", ["seller_id"])
    op.create_foreign_key(
        "order_items_seller_id_fkey",
        "order_items",
        "users",
        ["seller_id"],
        ["id"],
        ondelete="SET NULL",
    )
    # Backfill from products.seller_id where product still exists
    op.execute(
        """
        UPDATE order_items
        SET seller_id = (
            SELECT products.seller_id FROM products
            WHERE products.id = order_items.product_id
        )
        WHERE product_id IS NOT NULL
        """
    )


def downgrade() -> None:
    op.drop_constraint("order_items_seller_id_fkey", "order_items", type_="foreignkey")
    op.drop_index("ix_order_items_seller_id", table_name="order_items")
    op.drop_column("order_items", "seller_id")
