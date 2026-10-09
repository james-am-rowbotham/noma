"""a datastream says how often to expect it

Without this, a dead feed and a quiet volcano are the same picture. A monitor is the worst place for
that: the whole point of one is that you have stopped looking (DESIGN-0004).

FRESHNESS IS TWO DIFFERENT QUESTIONS, and only one of them is answered by this column.

  - **Sampled things** — a GNSS position, a satellite pass. They arrive on a rhythm, so "late"
    means the next one did not turn up. That rhythm is this column.
  - **Things that happen** — earthquakes. A week with no earthquakes is a quiet week, not a broken
    feed. There is no rhythm to be late against, and the only honest freshness is *when Noma last
    managed to ask*, which `event_fetch.fetched_at` already records.

So nothing here is added to the earthquake tables, and that is deliberate rather than unfinished.

WHY AN INTERVAL AND NOT A NUMBER OF SECONDS: Postgres has the type, it keeps "1 day" readable in
psql, and it maps to timedelta in Python without a units convention to get wrong — the kind of
conversion CLAUDE.md warns about.

NULL means "no stated rhythm", which is a real answer and not missing data: a campaign survey or an
eruption bulletin has no cadence, and a stream with none can never be called late. That is the same
rule as an unreported uncertainty — the slot exists so that "unknown" can be said out loud.

Measured on the 6,401-epoch ESLN series before choosing the shape: the median gap between
consecutive readings is **exactly 1 day** across 6,400 gaps, but **362 of those gaps are longer**,
the largest being 135 days. So a cadence is what to EXPECT and not a promise, and anything deciding
"late" from it has to be tolerant — which is why the thresholds live in the client (DESIGN-0004) and
not in this column.

Revision ID: 022bf52916c9
Revises: 7c9ad6c90733
Create Date: 2026-10-09 13:20
"""

from collections.abc import Sequence

from alembic import op

revision: str = "022bf52916c9"
down_revision: str | Sequence[str] | None = "7c9ad6c90733"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("ALTER TABLE datastream ADD COLUMN expected_cadence interval")
    op.execute("""
        COMMENT ON COLUMN datastream.expected_cadence IS
        'How often a reading is expected. NULL means no stated rhythm, which is a real answer: '
        'a stream without one can never be called late.'
    """)

    # The series Noma already holds are INGV's daily GNSS positions, and the median measured gap is
    # exactly one day. Backfilled here rather than left NULL, because NULL would make every stream
    # Noma holds permanently unjudgeable and the honesty rules would have nothing to work on.
    op.execute("""
        UPDATE datastream SET expected_cadence = interval '1 day'
        WHERE observed_property LIKE 'displacement_%' AND expected_cadence IS NULL
    """)


def downgrade() -> None:
    op.execute("ALTER TABLE datastream DROP COLUMN IF EXISTS expected_cadence")
