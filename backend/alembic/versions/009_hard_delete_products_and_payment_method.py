"""Hard-delete products (nullable order_items.product_id) + payment_method on orders

Revision ID: 009
Revises: 008
Create Date: 2026-10-12

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "009"
down_revision: Union[str, None] = "008"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Allow deleting products while keeping historical order line items
    op.alter_column(
        "order_items",
        "product_id",
        existing_type=sa.Integer(),
        nullable=True,
    )
    # Drop existing FK and recreate with ON DELETE SET NULL
    # Constraint name may vary; use batch for portability where needed.
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    fks = inspector.get_foreign_keys("order_items")
    for fk in fks:
        if fk.get("constrained_columns") == ["product_id"] or (
            fk.get("referred_table") == "products"
            and "product_id" in (fk.get("constrained_columns") or [])
        ):
            op.drop_constraint(fk["name"], "order_items", type_="foreignkey")

    op.create_foreign_key(
        "order_items_product_id_fkey",
        "order_items",
        "products",
        ["product_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.add_column(
        "orders",
        sa.Column("payment_method", sa.String(length=30), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("orders", "payment_method")

    bind = op.get_bind()
    inspector = sa.inspect(bind)
    fks = inspector.get_foreign_keys("order_items")
    for fk in fks:
        if "product_id" in (fk.get("constrained_columns") or []):
            op.drop_constraint(fk["name"], "order_items", type_="foreignkey")

    # Cannot re-add NOT NULL if nulls exist; set orphan product_ids to 0 is unsafe.
    # Leave nullable on downgrade for safety, only restore FK without ON DELETE.
    op.create_foreign_key(
        "order_items_product_id_fkey",
        "order_items",
        "products",
        ["product_id"],
        ["id"],
    )
