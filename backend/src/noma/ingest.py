"""Fetching from an agency and storing what comes back.

Thin on purpose: the adapter knows the service (noma.adapters.ingv), the store knows the tables
(noma.store.quakes), and this is the seam that joins them. It exists so neither has to know about
the other.
"""

from datetime import datetime

from sqlalchemy import Connection

from noma.adapters.ingv import (
    INGV_EVENT_SERVICE,
    INGV_LICENCE,
    INGV_NAME,
    INGV_ROR,
    Fetched,
    event_query,
    fetch_events,
)
from noma.adapters.quakeml import ParsedQuakeML
from noma.domain.quake import SourceId
from noma.domain.source import Source
from noma.store.quakes import ingest_quakeml, save_source

INGV = Source(id=SourceId("ingv"), name=INGV_NAME, ror_id=INGV_ROR, licence=INGV_LICENCE)


def ingest_ingv_events(
    connection: Connection,
    *,
    starttime: datetime | None = None,
    endtime: datetime | None = None,
    minlatitude: float | None = None,
    maxlatitude: float | None = None,
    minlongitude: float | None = None,
    maxlongitude: float | None = None,
    minmagnitude: float | None = None,
    limit: int | None = None,
) -> ParsedQuakeML | None:
    """Ask INGV for earthquakes and store them. None when the catalogue matched nothing.

    Provenance is OBSERVED: an agency's own standard processing of its own instruments (ADR-0005).
    """
    url = event_query(
        INGV_EVENT_SERVICE,
        starttime=starttime,
        endtime=endtime,
        minlatitude=minlatitude,
        maxlatitude=maxlatitude,
        minlongitude=minlongitude,
        maxlongitude=maxlongitude,
        minmagnitude=minmagnitude,
        limit=limit,
    )
    fetched = fetch_events(url)
    if fetched is None:
        return None
    return store(connection, fetched)


def store(connection: Connection, fetched: Fetched) -> ParsedQuakeML:
    save_source(connection, INGV)
    return ingest_quakeml(
        connection,
        fetched.document,
        source_id=INGV.id,
        provenance="OBSERVED",
        retrieved_at=fetched.retrieved_at,
        media_type=fetched.media_type,
        request_url=fetched.request_url,
    )
