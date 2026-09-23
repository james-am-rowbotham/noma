"""keep every version of a record

Domain-model point 2: accounts accumulate for TWO reasons — agencies disagree, and the same agency
REVISES. An automatic detection is published in seconds and a human-reviewed one replaces it later.

The first schema enforced UNIQUE (source_id, public_id), which holds the first reason and breaks the
second: a revision arriving under the same public id would be rejected as a duplicate, and Noma
would keep the first, worst version for ever. That is the opposite of what the split is for.

So the key becomes (source_id, public_id, content_hash):

  - re-fetching identical data conflicts and does nothing
  - a genuine revision differs, so it lands beside the version before it
  - "what did we know at 10:25?" is then a query, not a wish

content_hash covers the record's own fields rather than the agency's `version` number, because it
does not depend on every agency maintaining that number honestly.

Revision ID: fa77a030e8c2
Revises: 96d07a2ea54d
Create Date: 2026-09-23 16:33
"""

from collections.abc import Sequence

from alembic import op

revision: str = "fa77a030e8c2"
down_revision: str | Sequence[str] | None = "96d07a2ea54d"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

TABLES = ("quake_event", "quake_origin", "quake_magnitude")


def upgrade() -> None:
    for table in TABLES:
        op.execute(f"ALTER TABLE {table} ADD COLUMN content_hash bytea NOT NULL DEFAULT ''::bytea")
        op.execute(f"ALTER TABLE {table} ALTER COLUMN content_hash DROP DEFAULT")
        op.execute(f"ALTER TABLE {table} DROP CONSTRAINT {table}_source_id_public_id_key")
        op.execute(f"""
            ALTER TABLE {table}
            ADD CONSTRAINT {table}_version_key UNIQUE (source_id, public_id, content_hash)
        """)
        # Reading almost always wants the newest version of a record, or the newest as of a moment.
        op.execute(f"""
            CREATE INDEX {table}_versions ON {table} (source_id, public_id, retrieved_at DESC)
        """)


def downgrade() -> None:
    # Only reversible while each record has one version; with several, the old constraint cannot
    # be restored, and failing loudly is better than silently discarding revisions.
    for table in TABLES:
        op.execute(f"DROP INDEX IF EXISTS {table}_versions")
        op.execute(f"ALTER TABLE {table} DROP CONSTRAINT {table}_version_key")
        op.execute(f"""
            ALTER TABLE {table}
            ADD CONSTRAINT {table}_source_id_public_id_key UNIQUE (source_id, public_id)
        """)
        op.execute(f"ALTER TABLE {table} DROP COLUMN content_hash")
