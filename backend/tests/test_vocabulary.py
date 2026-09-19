"""The generated vocabularies must be exactly what QuakeML's own schema file says. A misspelt value
would make real, valid earthquakes fail to parse — so this reads the schema rather than trusting the
generated copy."""

import xml.etree.ElementTree as ET

import pytest

from noma.domain.vocabulary import VOCABULARIES
from tests.conftest import QUAKEML_XSD

XS = "{http://www.w3.org/2001/XMLSchema}"
ROOT = ET.parse(QUAKEML_XSD).getroot()


def enumeration(name: str) -> tuple[str, ...]:
    for t in ROOT:
        if t.tag == XS + "simpleType" and t.get("name") == name:
            return tuple(e.get("value", "") for e in t.iter(XS + "enumeration"))
    raise AssertionError(f"QuakeML schema has no simpleType {name}")


@pytest.mark.parametrize("name", sorted(VOCABULARIES))
def test_matches_the_official_schema(name: str):
    assert VOCABULARIES[name] == enumeration(name)


def test_every_event_type_is_there():
    # 44, not the ~30 estimated from memory before the file was read (ADR-0002).
    assert len(VOCABULARIES["EventType"]) == 44
