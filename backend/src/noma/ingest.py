"""Storing what an agency sent.

Thin on purpose: the adapter knows the standard (noma.adapters.fdsnws), the store knows the tables
(noma.store.quakes), and this is the seam that joins them.
"""

from sqlalchemy import Connection

from noma.adapters.fdsnws import Fetched
from noma.adapters.quakeml import ParsedQuakeML
from noma.domain.quake import ProvenanceClass, SourceId
from noma.store.quakes import ingest_quakeml


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
