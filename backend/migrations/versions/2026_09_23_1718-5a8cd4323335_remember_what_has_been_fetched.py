"""remember what has been fetched

Noma fetches when someone looks at a place, rather than polling on a schedule. That only works if
it remembers what it already asked for — otherwise every pan and zoom re-downloads the same
earthquakes.

One row per request made to an agency: the area, the window, the filter, and when. It is also the
provenance of the FETCH itself, which is a different thing from the provenance of a record: it
answers "why does Noma have this, and what else did the same question return".

`found` distinguishes "we asked and the catalogue was empty" from "we never asked". Without it an
empty area would be re-requested on every look.

Revision ID: 5a8cd4323335
Revises: fa77a030e8c2
Create Date: 2026-09-23 17:18
"""

from collections.abc import Sequence

from alembic import op

revision: str = "5a8cd4323335"
down_revision: str | Sequence[str] | None = "fa77a030e8c2"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE event_fetch (
            id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            source_id   text NOT NULL REFERENCES source(id),
            fetched_at  timestamptz NOT NULL,

            -- What was asked for. GEOMETRY, not geography — the opposite choice to
            -- quake_origin.point, and for a good reason: that column MEASURES DISTANCE, which
            -- geography answers in metres; this one only ever asks CONTAINMENT, "is the area being
            -- looked at inside one already fetched?".
            --
            -- Measured 2026-09-23: ST_Covers on a geography polygon returns FALSE even for a
            -- polygon covering itself, because geography's polygon-to-polygon support is limited.
            -- As geometry the same three tests answer true / true / false, correctly.
            area          geometry(Polygon, 4326) NOT NULL,
            window_start  timestamptz NOT NULL,
            window_end    timestamptz NOT NULL,
            -- A fetch filtered to M2+ does NOT satisfy a later request for everything, so the
            -- filter is part of what was covered, not a detail.
            min_magnitude double precision,

            found        integer NOT NULL,   -- events returned; 0 means asked and empty
            request_url  text NOT NULL,
            -- Null when the catalogue returned nothing: there was no document to keep.
            raw_document_id uuid REFERENCES raw_document(id) ON DELETE RESTRICT
        )
    """)
    # "Have we already covered this?" is asked on every look, so it is the query to make fast.
    op.execute("CREATE INDEX event_fetch_area ON event_fetch USING GIST (area)")
    op.execute("CREATE INDEX event_fetch_recent ON event_fetch (source_id, fetched_at DESC)")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS event_fetch")
