"""Things measured continuously — family 2 of the domain model.

A STATION is an instrument somewhere. A DATASTREAM is one instrument measuring one property, and is
where the unit lives. An OBSERVATION is one reading, and is where the uncertainty lives, because it
is genuinely different every time. The names are OGC SensorThings' (domain-model point 3).

Names follow the same rule as the QuakeML types: snake_case in Python, and the serialised form —
the API, OpenAPI, and so the browser's generated types — uses the standard's own spelling.
"""

from datetime import timedelta

from pydantic import AwareDatetime

from noma.domain.quake import Envelope, Metres, Model


class Station(Model):
    envelope: Envelope
    #: The agency's own identifier, e.g. "ESLN00ITA". Noma does not invent one.
    public_id: str
    name: str | None = None
    longitude: float
    latitude: float
    #: Height above the WGS84 ellipsoid. Positive is UP — the opposite of an earthquake's depth,
    #: which is why both carry the direction in their name or their comment.
    elevation_m: Metres | None = None


class Datastream(Model):
    envelope: Envelope
    public_id: str
    station_public_id: str
    #: What is measured. Free text: unlike QuakeML's event types, no standard hands us a closed
    #: vocabulary here, and inventing one would be worse than naming the thing plainly.
    observed_property: str
    #: UCUM, which is what SensorThings says unitOfMeasurement SHOULD follow. "m" for metres.
    unit: str
    #: How it was measured — the instrument, or the software and version that produced it. The
    #: observation standard's `procedure`, and for a processed product the only honest answer to
    #: "how do you know?".
    procedure: str | None = None
    #: What a displacement is measured against. Without it a number of metres measures nothing:
    #: "moved 38 cm east" is meaningless until you say east relative to what.
    reference_frame: str | None = None
    #: How often a reading is expected. Not a promise and not a measurement of this stream: it is
    #: what the agency publishes on, and a reader compares it against `last_observed` to decide
    #: whether a feed has stopped (DESIGN-0004).
    #:
    #: None means NO STATED RHYTHM, and it is a real answer rather than missing data — a campaign
    #: survey has none, and a stream without one can never be called late. Same discipline as an
    #: unreported uncertainty: the slot exists so "unknown" can be said out loud.
    #:
    #: Noma does NOT send a freshness verdict. Whether this stream is late depends on when someone
    #: looks, which only the reader knows, so the reader is given the two facts and does the
    #: arithmetic. See DESIGN-0004.
    expected_cadence: timedelta | None = None


class Observation(Model):
    envelope: Envelope
    datastream_public_id: str
    #: When it happened in the world, and when the number was produced. Two different things, and
    #: for a reprocessed product they can be years apart.
    phenomenon_time: AwareDatetime
    result_time: AwareDatetime | None = None
    result: float
    #: The agency's own standard deviation for THIS reading.
    uncertainty: float | None = None
    #: The agency's own word for how settled the reading is — "final", "rapid". The same idea as an
    #: earthquake origin being automatic or reviewed.
    solution: str | None = None
