"""Storing what an agency sent.

Thin on purpose: the adapter knows the standard (noma.adapters.fdsnws), the store knows the tables
(noma.store.quakes), and this is the seam that joins them.
"""

from datetime import UTC, datetime

import httpx2 as httpx
from sqlalchemy import Connection

from noma.adapters.fdsnws import CatalogueError, Fetched
from noma.adapters.gnss_pos import parse_pos
from noma.adapters.quakeml import ParsedQuakeML
from noma.domain.quake import Envelope, ProvenanceClass, SourceId
from noma.store.quakes import ingest_quakeml, save_document
from noma.store.series import save_series


def store(
    connection: Connection,
    fetched: Fetched,
    *,
    source_id: SourceId,
    provenance: ProvenanceClass = "OBSERVED",
) -> ParsedQuakeML:
    """OBSERVED by default: an agency processing its own instruments (ADR-0005)."""
    return ingest_quakeml(
        connection,
        fetched.document,
        source_id=source_id,
        provenance=provenance,
        retrieved_at=fetched.retrieved_at,
        media_type=fetched.media_type,
        request_url=fetched.request_url,
    )


#: INGV, the source these series come from. A module-level constant rather than a default argument,
#: which would build a new one on every import.
INGV = SourceId("ingv")

#: Where INGV's RING network publishes GNSS position series. One file per station, 1,354 of them,
#: CC BY 4.0 (DOI 10.13127/gnss/gipos). Verified 2026-09-24.
RING_POS = "https://webring.gm.ingv.it:44324/products/POS/ITRF/{station}/{station}.gipsyX.IGS20.pos"


def fetch_station_series(station: str, *, timeout: float = 120.0) -> Fetched:
    """Fetch one station's position series. `station` is the agency's 9-character id with its
    country suffix, e.g. "ESLN00ITA"."""
    url = httpx.URL(RING_POS.format(station=station))
    try:
        response = httpx.get(url, timeout=timeout, follow_redirects=True)
    except httpx.HTTPError as e:
        raise CatalogueError(f"could not reach {url.host}: {e}") from e

    retrieved_at = datetime.now(tz=UTC)
    if response.status_code != 200:
        raise CatalogueError(f"{url.host} answered {response.status_code} for {station}")
    # The server sends application/octet-stream, so the content type proves nothing here; the
    # parser checks the shape instead and refuses anything that is not a position file.
    return Fetched(
        document=response.content,
        request_url=str(url),
        retrieved_at=retrieved_at,
        media_type="text/plain",
    )


def ingest_station_series(
    connection: Connection, station: str, *, source_id: SourceId = INGV
) -> dict[str, int]:
    """Fetch a station's series and store it. OBSERVED: an agency's own processing of its own
    instruments (ADR-0005) — the processing software and version travel on the datastream."""
    fetched = fetch_station_series(station)
    document_id = save_document(
        connection,
        fetched.document,
        source_id=source_id,
        retrieved_at=fetched.retrieved_at,
        media_type=fetched.media_type,
        request_url=fetched.request_url,
    )
    envelope = Envelope(
        provenance="OBSERVED",
        source_id=source_id,
        retrieved_at=fetched.retrieved_at,
        raw=str(document_id),
    )
    return save_series(connection, parse_pos(fetched.document, envelope))
