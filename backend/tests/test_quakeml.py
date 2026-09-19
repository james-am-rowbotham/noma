"""The spec for the QuakeML adapter, written against a REAL record rather than a made-up one.

The fixture is one earthquake fetched from INGV on 2026-09-18: M3.9 ML, 7 km W Linguaglossa, on
Etna's north-east flank, 2026-08-15. It exercises every awkward part at once — a depth in metres
that would be absurd read as kilometres, an uncertainty on the magnitude, a full quality block, a
22-minute gap between the shaking and the published number, and INGV's own extensions.

Ported from the TypeScript spec this replaced (ADR-0003); the values are unchanged.
"""

import time as clock
from datetime import UTC, datetime, timedelta

import pytest

from noma.adapters.quakeml import ParsedQuakeML, QuakeMLError, parse_quakeml
from noma.domain.quake import Envelope, Metres, SourceId
from tests.conftest import ETNA

XML = ETNA.read_text()
ENVELOPE = Envelope(
    provenance="OBSERVED",
    source_id=SourceId("ingv"),
    retrieved_at=datetime(2026, 9, 18, 19, 51, tzinfo=UTC),
    raw=str(ETNA.relative_to(ETNA.parents[2])),
)


def parse(document: str = XML) -> ParsedQuakeML:
    return parse_quakeml(document.encode(), ENVELOPE)


@pytest.fixture(scope="module")
def etna() -> ParsedQuakeML:
    return parse()


class TestOneRealINGVEarthquake:
    def test_one_event_one_origin_one_magnitude(self, etna: ParsedQuakeML):
        assert (len(etna.events), len(etna.origins), len(etna.magnitudes)) == (1, 1, 1)

    def test_the_event_is_an_identity_not_a_measurement(self, etna: ParsedQuakeML):
        # The Event carries NO magnitude and NO location. That is the whole point of the split.
        event = etna.events[0]
        assert (event.type, event.description, event.agency_id) == (
            "earthquake",
            "7 km W Linguaglossa (CT)",
            "INGV",
        )
        assert not hasattr(event, "mag")
        assert not hasattr(event, "latitude")

    def test_it_points_at_accounts_that_exist(self, etna: ParsedQuakeML):
        event = etna.events[0]
        assert event.preferred_origin_id in {o.public_id for o in etna.origins}
        assert event.preferred_magnitude_id in {m.public_id for m in etna.magnitudes}

    def test_depth_is_in_metres_as_quakeml_gives_it(self, etna: ParsedQuakeML):
        # 1210 m = 1.2 km. Read as kilometres this earthquake would sit 1,210 km down — through the
        # crust, through the mantle, most of the way to the outer core.
        depth = etna.origins[0].depth
        assert depth is not None
        assert depth.value == Metres(1210)

    def test_it_is_on_etna(self, etna: ParsedQuakeML):
        origin = etna.origins[0]
        assert (origin.latitude.value, origin.longitude.value) == (37.832, 15.07)

    def test_the_time_is_utc_even_on_a_machine_that_is_not(self, etna: ParsedQuakeML):
        # ObsPy's times come back with no timezone. Left that way, they are read as local time.
        assert clock.timezone != 0, "this test must not run in UTC — see conftest.py"
        assert etna.origins[0].time.value == datetime(2026, 8, 15, 10, 24, 8, 910000, tzinfo=UTC)

    def test_microseconds_survive(self, etna: ParsedQuakeML):
        # JavaScript's Date truncated these to milliseconds; Python keeps them (ADR-0003).
        assert etna.origins[0].time.value.microsecond == 910000

    def test_when_it_happened_is_kept_apart_from_when_it_was_published(self, etna: ParsedQuakeML):
        # 22 minutes. Collapsing these loses "what did we know at 10:25?".
        origin = etna.origins[0]
        assert origin.creation_time is not None
        assert origin.creation_time == datetime(2026, 8, 15, 10, 46, 43, tzinfo=UTC)
        assert origin.creation_time - origin.time.value == timedelta(minutes=22, seconds=34.09)

    def test_the_magnitude_keeps_its_uncertainty(self, etna: ParsedQuakeML):
        # 3.9 ± 0.2. "Above magnitude 4" excludes this event, though it may honestly be 4.1.
        magnitude = etna.magnitudes[0]
        assert (magnitude.mag.value, magnitude.mag.uncertainty) == (3.9, 0.2)
        assert (magnitude.type, magnitude.agency_id) == ("ML", "INGV")

    def test_the_location_keeps_its_uncertainty(self, etna: ParsedQuakeML):
        u = etna.origins[0].uncertainty
        assert (u.horizontal_uncertainty, u.confidence_level) == (200, 68)

    def test_the_quality_block_nothing_will_draw_is_kept(self, etna: ParsedQuakeML):
        # azimuthal_gap is how a seismologist decides whether to trust the location at all.
        q = etna.origins[0].quality
        assert (q.azimuthal_gap, q.standard_error, q.used_phase_count, q.used_station_count) == (
            108,
            0.25,
            18,
            15,
        )

    def test_it_records_that_a_human_reviewed_it(self, etna: ParsedQuakeML):
        origin = etna.origins[0]
        assert (origin.evaluation_mode, origin.evaluation_status) == ("manual", "reviewed")

    def test_every_record_wears_the_envelope_it_was_given(self, etna: ParsedQuakeML):
        # The provenance class is Noma's: QuakeML has no opinion on measurement versus simulation.
        for record in [*etna.events, *etna.origins, *etna.magnitudes]:
            assert record.envelope == ENVELOPE

    def test_nomas_fields_stay_out_of_quakemls(self, etna: ParsedQuakeML):
        # ADR-0002: re-serving is the record without its envelope. That is only safe if no envelope
        # field has leaked to the top level.
        quakeml = etna.origins[0].model_dump(exclude={"envelope"})
        assert not set(ENVELOPE.model_dump()) & set(quakeml)

    def test_serialised_names_are_quakemls_own(self, etna: ParsedQuakeML):
        # What the API emits, and so what the browser's generated types see (ADR-0003).
        out = etna.events[0].model_dump(by_alias=True)
        assert {"publicID", "preferredOriginID", "preferredMagnitudeID", "agencyID"} <= set(out)


class TestRefusingWhatTheStandardDoesNotAllow:
    """ObsPy accepts or silently drops every one of these but the missing depth (ADR-0003)."""

    @staticmethod
    def edit(old: str, new: str) -> str:
        assert old in XML, f"fixture no longer contains {old!r}"
        return XML.replace(old, new)

    def test_an_unknown_event_type_is_refused_not_dropped(self):
        # ObsPy's own behaviour: drop the whole earthquake, and warn.
        with pytest.raises(QuakeMLError, match="quake-ish"):
            parse(self.edit("<type>earthquake</type>", "<type>quake-ish</type>"))

    def test_an_origin_with_no_latitude_is_refused(self):
        # Required by the spec document, not by the schema file — and ObsPy accepts it silently.
        with pytest.raises(QuakeMLError, match="latitude is missing"):
            parse(self.edit("<latitude>\n          <value>37.832</value>\n        </latitude>", ""))

    def test_a_number_that_is_not_a_number_is_refused_not_blanked(self):
        # ObsPy's own behaviour: turn "deep" into a missing depth, and warn.
        with pytest.raises(QuakeMLError, match="deep"):
            parse(self.edit("<value>1210</value>", "<value>deep</value>"))

    def test_an_origin_with_no_depth_is_accepted(self):
        # Depth is optional in QuakeML. Refusing it would reject valid earthquakes.
        document = self.edit("<depth>\n          <value>1210</value>\n        </depth>", "")
        assert parse(document).origins[0].depth is None
