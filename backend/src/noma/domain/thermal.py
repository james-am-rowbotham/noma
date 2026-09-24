"""Satellite thermal detections: a radiometer saw a patch of ground hotter than its surroundings.

For Etna this is the only open, live, numeric evidence that something is happening. The signal
volcanologists actually watch — volcanic tremor — is published as four PNG images
(docs/research/volcanic-activity.md).

It does not fit Noma's three families cleanly, and the migration that creates its table explains
why. The modelling question is left open in the domain model rather than answered by force.
"""

from pydantic import AwareDatetime

from noma.domain.quake import Envelope, Model


class ThermalDetection(Model):
    envelope: Envelope

    longitude: float
    latitude: float
    #: The footprint the satellite measured, in kilometres — around 375 m for this instrument.
    #: **A DETECTION IS A PIXEL, NOT A POINT.** Drawing the centre as a dot claims a precision the
    #: measurement does not have, so these are required and travel with every detection.
    scan_km: float
    track_km: float

    observed_at: AwareDatetime

    #: Fire radiative power in megawatts: how much heat the patch is radiating. This is the number
    #: that relates to eruptive intensity — and only loosely, through published relationships.
    frp_mw: float | None = None
    #: Brightness temperatures in KELVIN — the fire channel and the background channel.
    brightness_k: float | None = None
    brightness_background_k: float | None = None

    #: The provider's own word — "low", "nominal", "high" for this instrument. Deliberately NOT
    #: turned into a number: the scale is ordinal, and a number would invite arithmetic on it.
    confidence: str | None = None
    satellite: str | None = None
    #: "D" or "N". A night detection is more reliable, because sunlight cannot be mistaken for heat.
    day_night: str | None = None
    #: "NRT" for near-real-time, or a processed version. An NRT detection is replaced by the
    #: standard product later, which is a revision like any other (domain-model point 19).
    product_version: str | None = None
