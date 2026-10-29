"""Farmer farm_location and goods_to_sell

Revision ID: 013
Revises: 012
Create Date: 2026-10-29
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "013"
down_revision: Union[str, None] = "012"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("farm_location", sa.String(length=255), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("goods_to_sell", sa.Text(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "goods_to_sell")
    op.drop_column("users", "farm_location")
