import os
import time
from pathlib import Path

# Run every test as if in Amsterdam. On a UTC machine — a typical CI runner — treating a time as
# local gives the right answer by accident, so the timezone trap in ADR-0002 and ADR-0003 would go
# untested. This is set before anything reads the clock.
os.environ["TZ"] = "Europe/Amsterdam"
time.tzset()

REPO = Path(__file__).parents[2]
ETNA = REPO / "docs/research/example-quakeml-ingv-etna-2026-08-15.xml"
QUAKEML_XSD = REPO / "schemas/quakeml/1.2/QuakeML-BED-1.2.xsd"
