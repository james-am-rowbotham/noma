"""A fact: one measurement, already compared against something.

The output of the detection layer and the input to anything that judges. Its rules are in
[`docs/architecture/detection.md`](../../../../docs/architecture/detection.md) — this type exists to
make several of them hard to break rather than merely written down.

It is machine-readable on purpose. Turning a fact into words happens in exactly one place
(`noma.adapters.jev.evidence_from`), so the arithmetic is done once, here, and never handed to
something that cannot count.
"""

from collections.abc import Sequence
from datetime import timedelta

from pydantic import AwareDatetime

from noma.domain.quake import Model, ProvenanceClass


def in_words(d: timedelta) -> str:
    """A duration a reader does not have to do arithmetic on: "5 days", "6 hours".

    Coarse on purpose. "5 days, 3:42:11" invites someone to compute with it, and the one reader this
    is ultimately for — Jev — is documented as unable to. Callers add the sense: "the last 5 days"
    for a window, "5 days ago" for an age.
    """
    seconds = int(abs(d.total_seconds()))
    for size, name in ((86_400, "day"), (3_600, "hour"), (60, "minute")):
        if seconds >= size:
            n = seconds // size
            return f"{n} {name}{'s' if n != 1 else ''}"
    return "less than a minute"


class Reading(Model):
    #: What this is, naming the arithmetic that produced it (DET-1). "Earthquakes near Etna's
    #: summit" — not "earthquakes", which would be equally true of a dozen other computations.
    label: str
    #: The period the arithmetic covers, in words: "the last 24 hours" (DET-2). None only for an
    #: instantaneous measurement, where there is no period to state — a single satellite pass is a
    #: reading, not an aggregate.
    window: str | None = None

    value: float
    #: UCUM where the source gives one. Travels with the value because a number without its unit is
    #: not a measurement.
    unit: str
    #: None means the source reported none, which is said out loud rather than omitted: a bare value
    #: claims a precision nobody stated (CLAUDE.md). For a derived value this is the propagated
    #: uncertainty, and a change smaller than it is not a change (DET-6).
    uncertainty: float | None = None

    #: When the measurement was made — or, for a fact derived from an event feed, when Noma last
    #: managed to ask. Used by the gate in front of Jev, never sent as a date.
    observed_at: AwareDatetime
    #: How often the next one is expected. None means no stated rhythm, so this can never be called
    #: late (domain model, point 25).
    expected_cadence: timedelta | None = None

    #: What the value is being compared against, in words, and how much history that comparison
    #: rests on (DET-3, DET-4). Without it a value is not evidence of change: changing against what?
    baseline: str | None = None

    #: The records this was computed from, named so a verdict can be re-derived from the same
    #: inputs rather than from a query re-run against different data (DET-8). Agency public ids
    #: where they exist; otherwise a stream id and a timestamp, which identifies a reading exactly.
    records: Sequence[str] = ()

    #: Noma did the arithmetic, so Noma is the source and Noma can be wrong (DET-9, ADR-0005). A
    #: fact is CALCULATED by construction: anything OBSERVED is a record, not a fact about records.
    provenance: ProvenanceClass = "CALCULATED"
