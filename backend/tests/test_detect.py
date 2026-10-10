"""Facts, and the rules they have to keep. See docs/architecture/detection.md.

The failure this layer exists to prevent is a number whose LABEL LIES. It cannot be caught
downstream: the gate in front of Jev catches a reading that has gone stale, and Jev itself judges
faithfully whatever it is handed. So it has to be caught here, by tests that know what each number
is supposed to mean.

Both real instances were in hand-written queries. One reported ground movement as "37.98 cm", the
total since 2005, where recent movement was meant. The other counted 83 earthquakes where there are
61, by counting rows in a table that keeps every revision on purpose.
"""

from collections.abc import Iterator
from datetime import UTC, datetime, timedelta
from math import sqrt

import pytest
from sqlalchemy import Connection, Engine, text

from noma.adapters.gnss_pos import parse_pos
from noma.adapters.quakeml import parse_quakeml
from noma.coverage import Area
from noma.detect import earthquake_rate, ground_movement
from noma.domain.quake import Envelope, SourceId
from noma.store.quakes import ingest_quakeml
from noma.store.series import save_series
from tests.conftest import ESLN, ETNA

pytestmark = pytest.mark.db

XML = ETNA.read_bytes()
POS = ESLN.read_bytes()

#: The fixture earthquake is 2026-08-15, so "now" sits a few days after it and the windows below
#: reach back past it. Fixed, because a test that depends on the time of day it runs is a test that
#: fails on a Friday.
NOW = datetime(2026, 8, 20, 12, 0, tzinfo=UTC)
FETCHED_AT = datetime(2026, 8, 20, 11, 0, tzinfo=UTC)
ETNA_BOX = Area(min_longitude=14.80, min_latitude=37.60, max_longitude=15.25, max_latitude=37.95)

WINDOW = timedelta(days=30)
BASELINE = timedelta(days=30)
ASK_EVERY = timedelta(hours=1)


@pytest.fixture
def conn(db: Engine) -> Iterator[Connection]:
    with db.connect() as connection:
        transaction = connection.begin()
        yield connection
        transaction.rollback()


def record_an_ask(conn: Connection, *, found: int = 1, at: datetime = FETCHED_AT) -> None:
    conn.execute(
        text("""
            INSERT INTO event_fetch (source_id, fetched_at, area, window_start, window_end,
                                     found, request_url)
            VALUES ('ingv', :at, ST_GeomFromText(:area, 4326), :start, :end, :found, 'test://')
        """),
        {
            "at": at,
            "area": ETNA_BOX.as_wkt(),
            "start": NOW - BASELINE,
            "end": NOW,
            "found": found,
        },
    )


def ingest(conn: Connection, document: bytes = XML, *, at: datetime = FETCHED_AT) -> None:
    ingest_quakeml(
        conn, document, source_id=SourceId("ingv"), provenance="OBSERVED", retrieved_at=at
    )


def rate(conn: Connection):
    return earthquake_rate(
        conn,
        ETNA_BOX,
        place="Etna's summit",
        window=WINDOW,
        baseline=BASELINE,
        ask_every=ASK_EVERY,
        now=NOW,
    )


class TestCountingEarthquakes:
    def test_det5_a_count_counts_distinct_earthquakes_not_rows(self, conn: Connection):
        # DET-5. The same earthquake, revised: a moved location and a magnitude the review changed.
        # Both versions are kept on purpose, and a count of rows would report two earthquakes.
        record_an_ask(conn)
        ingest(conn)
        revised = (
            XML.replace(b"<value>37.832</value>", b"<value>37.840</value>")
            .replace(b"<value>3.9</value>", b"<value>4.1</value>")
            .replace(b"<evaluationStatus>reviewed", b"<evaluationStatus>final")
        )
        ingest(conn, revised, at=FETCHED_AT + timedelta(minutes=30))

        rows = conn.execute(text("SELECT count(*) FROM quake_origin")).scalar_one()
        assert rows == 2, "both versions must be stored, or this test proves nothing"

        reading = rate(conn)
        assert reading is not None
        assert reading.value == 1, "two stored versions of one earthquake is one earthquake"

    def test_det1_the_label_names_the_arithmetic(self, conn: Connection):
        # DET-1. "Earthquakes" would be equally true of a dozen other computations; this one is
        # about a place.
        record_an_ask(conn)
        ingest(conn)
        reading = rate(conn)
        assert reading is not None
        assert reading.label == "Earthquakes near Etna's summit"

    def test_det2_the_window_is_stated(self, conn: Connection):
        # DET-2. A count without a window is not a count: "0 earthquakes" says nothing until it
        # says since when.
        record_an_ask(conn)
        ingest(conn)
        reading = rate(conn)
        assert reading is not None
        assert reading.window == "the last 30 days"

    def test_det3_a_fact_carries_a_baseline(self, conn: Connection):
        # DET-3. A value alone cannot support "changing": changing against what?
        record_an_ask(conn)
        ingest(conn)
        reading = rate(conn)
        assert reading is not None
        assert reading.baseline

    def test_det4_the_baseline_states_the_history_behind_it(self, conn: Connection):
        # DET-4. The fixture holds ONE earthquake, so a 30-day baseline rests on no span at all —
        # and must say so rather than describing itself as a 30-day average.
        record_an_ask(conn)
        ingest(conn)
        reading = rate(conn)
        assert reading is not None
        assert "30 days" not in (reading.baseline or ""), reading.baseline
        assert "history Noma holds" in (reading.baseline or "")

    def test_det8_the_records_are_named(self, conn: Connection):
        # DET-8. So a verdict can be re-derived from the same inputs, rather than from a query
        # re-run against data that has moved on.
        record_an_ask(conn)
        parsed = parse_quakeml(
            XML,
            Envelope(
                provenance="OBSERVED", source_id=SourceId("ingv"), retrieved_at=FETCHED_AT, raw=""
            ),
        )
        ingest(conn)
        reading = rate(conn)
        assert reading is not None
        assert list(reading.records) == [parsed.events[0].public_id]

    def test_det9_a_derived_fact_is_calculated(self, conn: Connection):
        # DET-9. Noma did the arithmetic, so Noma is the source and Noma can be wrong (ADR-0005).
        record_an_ask(conn)
        ingest(conn)
        reading = rate(conn)
        assert reading is not None
        assert reading.provenance == "CALCULATED"

    def test_the_freshness_that_travels_is_our_own_asking(self, conn: Connection):
        # An event feed has no rhythm of its own, so what can go stale is Noma's asking, not the
        # earthquakes (domain model, point 25).
        record_an_ask(conn)
        ingest(conn)
        reading = rate(conn)
        assert reading is not None
        assert reading.observed_at == FETCHED_AT
        assert reading.expected_cadence == ASK_EVERY


class TestAbsenceIsNeverZero:
    def test_det7_a_source_never_asked_gives_no_fact_at_all(self, conn: Connection):
        # DET-7. Not a zero. "No earthquakes" from a catalogue nobody queried is a fact about Noma,
        # and a zero here would be indistinguishable from a quiet fortnight.
        ingest(conn)
        assert rate(conn) is None

    def test_asked_and_empty_is_a_real_zero_that_says_what_it_rests_on(self, conn: Connection):
        # The other half of DET-7: having asked, nothing found IS a measurement — and it has to say
        # that it found nothing to compare against either.
        record_an_ask(conn, found=0)
        reading = rate(conn)
        assert reading is not None
        assert reading.value == 0
        assert "nothing held" in (reading.baseline or "")


class TestGroundMovement:
    """The fixture is six real epochs: five consecutive days in September 2005, then one in
    January 2026. Measured from it, which is what makes the assertions below exact:

        2005-09-14    0.00 mm ±1.36      2005-09-17    1.28 mm ±1.30
        2005-09-15    0.57 mm ±1.39      2005-09-18   -0.15 mm ±1.29
        2005-09-16    0.40 mm ±1.29      2026-01-21  379.85 mm ±1.46

    So the same stream gives -0.15 mm over five days and 379.85 mm over twenty years. Those two
    numbers are the whole point of this class: one of them is movement and the other is an
    odometer, and the bug this layer exists to prevent reported the second where the first was
    meant.
    """

    @pytest.fixture(autouse=True)
    def series(self, conn: Connection) -> None:
        document = conn.execute(
            text("""
                INSERT INTO raw_document (source_id, retrieved_at, media_type, sha256, content)
                VALUES ('ingv', :at, 'text/plain', sha256(:c), :c) RETURNING id
            """),
            {"at": FETCHED_AT, "c": POS},
        ).scalar_one()
        save_series(
            conn,
            parse_pos(
                POS,
                Envelope(
                    provenance="OBSERVED",
                    source_id=SourceId("ingv"),
                    retrieved_at=FETCHED_AT,
                    raw=str(document),
                ),
            ),
        )

    def movement(self, conn: Connection, *, window: timedelta, now: datetime):
        return ground_movement(conn, "ESLN", "displacement_east", window=window, now=now)

    def five_days(self, conn: Connection):
        """The five consecutive 2005 days: -0.15 mm against a propagated +/-1.87 mm."""
        return self.movement(
            conn, window=timedelta(days=5), now=datetime(2005, 9, 18, 12, 0, tzinfo=UTC)
        )

    def whole_span(self, conn: Connection):
        """Everything, 2005 to 2026: 379.85 mm, which is real and is not recent."""
        return self.movement(
            conn, window=timedelta(days=7500), now=datetime(2026, 1, 21, 12, 0, tzinfo=UTC)
        )

    def test_det6_a_change_smaller_than_its_uncertainty_is_not_a_change(self, conn: Connection):
        # DET-6. Over those five days the ground "moved" -0.15 mm, and the two readings carry
        # +/-1.36 and +/-1.29. The movement is an order of magnitude inside the instrument.
        reading = self.five_days(conn)
        assert reading is not None
        assert reading.value == pytest.approx(-0.15, abs=0.01)
        assert reading.uncertainty == pytest.approx(1.87, abs=0.01)
        assert reading.baseline == "smaller than its own uncertainty — not a change"

    def test_the_uncertainty_is_of_the_change_not_of_one_reading(self, conn: Connection):
        # Added in quadrature: sqrt(1.36^2 + 1.29^2) = 1.87. Quoting one reading's own figure would
        # understate the uncertainty of a difference by about 40%.
        reading = self.five_days(conn)
        assert reading is not None
        assert reading.uncertainty is not None
        assert reading.uncertainty > 1.36, "a difference is less certain than either reading"
        assert reading.uncertainty == pytest.approx(sqrt(1.36**2 + 1.29**2), abs=0.02)

    def test_the_value_is_the_change_over_the_window_and_not_a_running_total(
        self, conn: Connection
    ):
        # THE 37.98 cm BUG, both halves from one stream. Five days is -0.15 mm; twenty years is
        # 379.85 mm. A fact that states its window must report the first when asked for the first.
        five_days = self.five_days(conn)
        whole_span = self.whole_span(conn)
        assert five_days is not None and whole_span is not None
        assert five_days.value == pytest.approx(-0.15, abs=0.01)
        assert whole_span.value == pytest.approx(379.85, abs=0.01)
        assert five_days.window != whole_span.window

    def test_the_change_is_measured_from_the_window_not_from_the_series(self, conn: Connection):
        # THE SAME BUG AGAIN, and the version that can actually catch it. The two tests above
        # cannot: this series begins at exactly 0.00 mm, so for any window starting at the first
        # reading the running total and the change from the first reading are the SAME NUMBER.
        # They were reassuring and hollow, and only a sabotage pass showed it.
        #
        # A window that starts later tells them apart. 2005-09-16 to 2005-09-18 runs 0.40 -> -0.15,
        # so the change is -0.55 mm while the running total at the end is -0.15 mm.
        reading = self.movement(
            conn, window=timedelta(days=3), now=datetime(2005, 9, 18, 12, 0, tzinfo=UTC)
        )
        assert reading is not None
        assert reading.value == pytest.approx(-0.55, abs=0.01), (
            "the change must be measured from the first reading INSIDE the window"
        )

    def test_a_real_change_is_not_dismissed(self, conn: Connection):
        # The other side of DET-6: 379.85 mm against +/-2 mm is movement, and the baseline must not
        # wave it away. A rule that only ever says "not a change" would be useless.
        whole_span = self.whole_span(conn)
        assert whole_span is not None
        assert "not a change" not in (whole_span.baseline or "")
        assert "IGS20" in (whole_span.baseline or ""), "a displacement needs its reference frame"

    def test_the_unit_travels_with_the_converted_value(self, conn: Connection):
        # Stored in metres, reported in millimetres because 0.00015 reads as nothing. The
        # conversion is only honest if the unit says so.
        reading = self.five_days(conn)
        assert reading is not None
        assert reading.unit == "mm"

    def test_a_single_reading_is_not_a_change(self, conn: Connection):
        # A change needs two points. Inventing one from a single reading is the same class of error
        # this module exists to prevent.
        assert (
            self.movement(
                conn, window=timedelta(days=1), now=datetime(2026, 1, 21, 12, 0, tzinfo=UTC)
            )
            is None
        )

    def test_an_unknown_stream_gives_nothing(self, conn: Connection):
        assert ground_movement(conn, "ESLN", "temperature", window=WINDOW, now=NOW) is None
