"""stations, datastreams and observations

Family 2 of the domain model: things measured continuously. A STATION is an instrument somewhere; a
DATASTREAM is one instrument measuring one property, which is where the unit lives; an OBSERVATION
is one reading. The names are OGC SensorThings' (domain-model point 3).

The first source is INGV's RING GNSS network: 1,354 stations publishing daily positions since 2005,
CC BY 4.0, DOI 10.13127/gnss/gipos. Every reading carries its own standard deviation, which makes
this better documented than the earthquake catalogues — there, fewer than half the depths state an
uncertainty.

WHY THE UNIT IS ON THE DATASTREAM AND NOT THE READING: every reading in a stream shares it, and
storing "m" twenty thousand times would be waste. WHY THE UNCERTAINTY IS ON THE READING: it is
genuinely different for every one.

Revision ID: f99d9207fa02
Revises: 28e4a8fd1690
Create Date: 2026-09-24 16:19
"""

from collections.abc import Sequence

from alembic import op

revision: str = "f99d9207fa02"
down_revision: str | Sequence[str] | None = "28e4a8fd1690"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

PROVENANCE = "'OBSERVED', 'CALCULATED', 'MODELLED', 'SIMULATED', 'INFERRED', 'FORECAST'"

ENVELOPE = f"""
    provenance      text NOT NULL CHECK (provenance IN ({PROVENANCE})),
    source_id       text NOT NULL REFERENCES source(id),
    retrieved_at    timestamptz NOT NULL,
    raw_document_id uuid NOT NULL REFERENCES raw_document(id) ON DELETE RESTRICT,
"""


def upgrade() -> None:
    op.execute(f"""
        CREATE TABLE station (
            id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            {ENVELOPE}
            -- The agency's own identifier, e.g. "ESLN00ITA". Noma does not invent one.
            public_id text NOT NULL,
            name      text,

            -- GEOGRAPHY: "stations near here" is a distance question, answered in metres, exactly
            -- as quake_origin.point is (ADR-0004).
            point geography(Point, 4326) NOT NULL,
            -- Height above the WGS84 ellipsoid, in metres. NOT depth: positive is UP here, the
            -- opposite of quake_origin.depth_m, which is why both say so in their names.
            elevation_m double precision,

            UNIQUE (source_id, public_id)
        )
    """)

    op.execute(f"""
        CREATE TABLE datastream (
            id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            station_id uuid NOT NULL REFERENCES station(id) ON DELETE CASCADE,
            {ENVELOPE}
            public_id  text NOT NULL,

            -- What is measured. Free text for now: unlike QuakeML's event types there is no closed
            -- vocabulary here that a standard hands us, and inventing one would be worse than
            -- naming the thing plainly.
            observed_property text NOT NULL,
            -- UCUM, which is what OGC SensorThings says unitOfMeasurement SHOULD follow
            -- (docs/research/standards.md). "m" for metres.
            unit text NOT NULL,
            -- How it was measured: the instrument, or the software and version that produced it.
            -- This is the observation standard's `procedure`, and for a processed product like a
            -- GNSS position series it is the only honest answer to "how do you know?".
            procedure text,
            -- The coordinate frame a displacement is measured against. Without it a number of
            -- metres is not a measurement of anything: "moved 38 cm east" is meaningless until you
            -- say east relative to what.
            reference_frame text,

            UNIQUE (source_id, public_id)
        )
    """)

    op.execute(f"""
        CREATE TABLE observation (
            id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            datastream_id uuid NOT NULL REFERENCES datastream(id) ON DELETE CASCADE,
            {ENVELOPE}

            -- When it happened in the world, and when the number was produced. Two different
            -- things (domain-model point 2), and for a reprocessed product they can be years apart.
            phenomenon_time timestamptz NOT NULL,
            result_time     timestamptz,

            result      double precision NOT NULL,
            -- The agency's own standard deviation for THIS reading. Not shared with the stream.
            uncertainty double precision,
            -- "final", "rapid" — the agency's own word for how settled this reading is, the same
            -- idea as an earthquake origin being automatic or reviewed.
            solution text,

            -- Same rule as the earthquake tables (domain-model point 19): an unchanged re-fetch
            -- conflicts and does nothing, a revised reading lands beside the one before it. A
            -- rapid solution replaced later by a final one is exactly that.
            content_hash bytea NOT NULL,
            UNIQUE (datastream_id, phenomenon_time, content_hash)
        )
    """)

    op.execute("CREATE INDEX station_point ON station USING GIST (point)")
    op.execute("CREATE INDEX observation_series ON observation (datastream_id, phenomenon_time)")
    op.execute("CREATE INDEX datastream_station ON datastream (station_id)")


def downgrade() -> None:
    for table in ("observation", "datastream", "station"):
        op.execute(f"DROP TABLE IF EXISTS {table}")
