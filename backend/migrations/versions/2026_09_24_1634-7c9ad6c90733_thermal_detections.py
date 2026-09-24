"""thermal detections

Satellite hotspots: a radiometer saw a patch of ground hotter than its surroundings. For Etna this
is the only open, live, numeric evidence that something is happening — volcanic tremor, the signal
volcanologists actually watch, is published as four PNG images
(docs/research/volcanic-activity.md).

WHERE THIS SITS IN THE DOMAIN MODEL IS NOT CLEAN, and this table says so rather than pretending.
It is not an Event (nothing happened at an instant — a radiometer looked), not a Datastream (no
instrument sits at a place producing a series), and not a grid. Under OGC SensorThings it would be
an Observation whose FeatureOfInterest is its own patch of ground, and family 2 has no room for
that: there, the location belongs to the station. So it gets its own table, and the modelling
question stays open in the domain model rather than being answered by force.

A DETECTION IS A PIXEL, NOT A POINT. `scan_km` and `track_km` are the footprint the satellite
actually measured — around 375 m for this instrument. Drawing the centre as a dot claims a
precision the measurement does not have, which is why both are stored and neither is optional.

Revision ID: 7c9ad6c90733
Revises: f99d9207fa02
Create Date: 2026-09-24 16:34
"""

from collections.abc import Sequence

from alembic import op

revision: str = "7c9ad6c90733"
down_revision: str | Sequence[str] | None = "f99d9207fa02"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

PROVENANCE = "'OBSERVED', 'CALCULATED', 'MODELLED', 'SIMULATED', 'INFERRED', 'FORECAST'"


def upgrade() -> None:
    op.execute(f"""
        CREATE TABLE thermal_detection (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

            provenance      text NOT NULL CHECK (provenance IN ({PROVENANCE})),
            source_id       text NOT NULL REFERENCES source(id),
            retrieved_at    timestamptz NOT NULL,
            raw_document_id uuid NOT NULL REFERENCES raw_document(id) ON DELETE RESTRICT,

            -- GEOGRAPHY, like quake_origin.point: "hotspots near here" is a distance question,
            -- answered in metres (ADR-0004).
            point geography(Point, 4326) NOT NULL,
            -- The footprint the satellite measured, in kilometres. A detection is a PIXEL.
            scan_km  double precision NOT NULL,
            track_km double precision NOT NULL,

            observed_at timestamptz NOT NULL,

            -- Fire radiative power, megawatts: how much heat the patch is radiating.
            frp_mw double precision,
            -- Brightness temperatures in KELVIN. The fire channel, and the background channel.
            brightness_k            double precision,
            brightness_background_k double precision,

            -- The provider's own word, kept as given: 'low', 'nominal' or 'high' for this
            -- instrument. NOT turned into a number — the scale is ordinal, not measured.
            confidence text,
            satellite  text,
            -- 'D' or 'N'. A night detection is more reliable: sunlight cannot be mistaken for heat.
            day_night text,
            -- 'NRT' for near-real-time, or a processed version. NRT is replaced by the standard
            -- product later, which is a revision like any other.
            product_version text,

            -- Same rule as everywhere else (domain-model point 19): an unchanged re-fetch conflicts
            -- and does nothing; a reprocessed detection lands beside the one before it.
            content_hash bytea NOT NULL,
            UNIQUE (source_id, point, observed_at, content_hash)
        )
    """)
    op.execute("CREATE INDEX thermal_detection_point ON thermal_detection USING GIST (point)")
    op.execute("CREATE INDEX thermal_detection_time ON thermal_detection (observed_at DESC)")

    # Seeded here, beside the table that needs it. No `event_service_url` and no `region`: those
    # say where Noma asks an agency for EARTHQUAKES, and FIRMS answers a different question
    # entirely. `_sources_for` skips a source with either one missing, so this row cannot pull
    # NASA into an earthquake fetch.
    op.execute("""
        INSERT INTO source (id, name, ror_id, licence) VALUES
        ('nasa_firms',
         'NASA Fire Information for Resource Management System',
         'https://ror.org/027ka1x80',
         -- NASA's Earth science data carry no redistribution restriction; FIRMS asks to be
         -- acknowledged (docs/research/volcanic-activity.md). Attribution is therefore a request
         -- here, not a licence condition as it is for INGV's CC-BY-4.0 — but Noma serves it the
         -- same way, because a reader cannot tell the difference and should not have to.
         'nasa-eosdis-open')
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name, ror_id = EXCLUDED.ror_id, licence = EXCLUDED.licence
    """)


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS thermal_detection")
    # The source row STAYS. Any FIRMS document already stored in raw_document still points at it,
    # so deleting it would fail on the foreign key — and a downgrade that fails on data is worse
    # than one that leaves a reference row behind.
