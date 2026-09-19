"""enable postgis

The first migration: switch on PostGIS. It lives here rather than in the database image so that
everything the database contains is written down in migrations (ADR-0004).

Revision ID: 41259de1fb55
Revises:
Create Date: 2026-09-19 13:56:48.740442
"""

from collections.abc import Sequence

from alembic import op

revision: str = "41259de1fb55"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis")


def downgrade() -> None:
    op.execute("DROP EXTENSION IF EXISTS postgis")
