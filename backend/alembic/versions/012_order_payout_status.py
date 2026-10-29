"""Add payout_status on orders (none|ready|paid)

Revision ID: 012
Revises: 011
Create Date: 2026-10-29
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "012"
down_revision: Union[str, None] = "011"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "orders",
        sa.Column(
            "payout_status",
            sa.String(length=20),
            nullable=False,
            server_default="none",
        ),
    )


def downgrade() -> None:
    op.drop_column("orders", "payout_status")
