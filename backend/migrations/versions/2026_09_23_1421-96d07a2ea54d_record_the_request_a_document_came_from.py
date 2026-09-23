"""record the request a document came from

CLAUDE.md asks for reproducibility. Knowing a document came from INGV on a given day does not let
anyone fetch it again; the exact query does. Nullable because a document can arrive by other means
— an upload, a file on disk — and then there is no request to record.

Revision ID: 96d07a2ea54d
Revises: 0c22d9a0da2f
Create Date: 2026-09-23 14:21
"""

from collections.abc import Sequence

from alembic import op

revision: str = "96d07a2ea54d"
down_revision: str | Sequence[str] | None = "0c22d9a0da2f"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("ALTER TABLE raw_document ADD COLUMN request_url text")


def downgrade() -> None:
    op.execute("ALTER TABLE raw_document DROP COLUMN request_url")
