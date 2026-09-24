"""Earthquake catalogues, over the FDSN event web service.

fdsnws-event 1.2 is the standard every seismic agency serves, so nothing here is specific to one of
them: which agency to ask, and where it answers for, are rows in the `source` table. Verified by
pointing this unchanged at USGS and parsing five Kilauea earthquakes.

Three things measured on 2026-09-18 and worth knowing before changing anything here
(docs/research/standards.md):

  - The spec defines only `xml` and `text`. GeoJSON exists at both INGV and USGS but is each
    provider's own invention, and neither can carry more than one origin or magnitude per event —
    the very thing domain-model point 2 keeps. So Noma asks for QuakeML.
  - INGV answered `format=json` with HTTP 200 and QuakeML anyway. The response's content type is
    therefore checked, not its status code.
  - A query matching nothing returns 204 No Content, not an empty document.
"""

from dataclasses import dataclass
from datetime import UTC, datetime

import httpx2 as httpx

#: The path every agency serves it at. Only the host differs, which is why it lives in the
#: database rather than here: https://www.fdsn.org/webservices/
EVENT_SERVICE_PATH = "/fdsnws/event/1/query"


class CatalogueError(RuntimeError):
    """The service could not be asked, or answered with something Noma will not read."""


@dataclass(frozen=True)
class Fetched:
    """A document exactly as the service returned it, and the request that produced it."""

    document: bytes
    request_url: str
    retrieved_at: datetime
    media_type: str


def event_query(
    base_url: str,
    *,
    starttime: datetime | None = None,
    endtime: datetime | None = None,
    minlatitude: float | None = None,
    maxlatitude: float | None = None,
    minlongitude: float | None = None,
    maxlongitude: float | None = None,
    minmagnitude: float | None = None,
    maxmagnitude: float | None = None,
    limit: int | None = None,
    orderby: str | None = None,
) -> httpx.URL:
    """Build an fdsnws-event query. Every name here is the STANDARD's own (fdsnws-event 1.2 §
    "query"), not a name Noma invented, so this reads the same against any agency's service.

    Times go out as ISO 8601 in UTC. The models refuse a time without a timezone, so a naive one
    cannot reach here — the trap recorded in ADR-0002 and ADR-0003.
    """
    given = {
        "starttime": starttime,
        "endtime": endtime,
        "minlatitude": minlatitude,
        "maxlatitude": maxlatitude,
        "minlongitude": minlongitude,
        "maxlongitude": maxlongitude,
        "minmagnitude": minmagnitude,
        "maxmagnitude": maxmagnitude,
        "limit": limit,
        "orderby": orderby,
    }
    params: dict[str, str] = {"format": "xml"}
    for name, value in given.items():
        if value is None:
            continue
        if isinstance(value, datetime):
            if value.tzinfo is None:
                raise ValueError(f"{name} has no timezone; fdsnws times are UTC")
            params[name] = value.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%S")
        else:
            params[name] = str(value)
    return httpx.URL(base_url, params=params)


def fetch_events(url: httpx.URL, *, timeout: float = 60.0) -> Fetched | None:
    """Fetch one QuakeML document. None when the service says it matched nothing (HTTP 204)."""
    try:
        response = httpx.get(url, timeout=timeout, follow_redirects=True)
    except httpx.HTTPError as e:
        raise CatalogueError(f"could not reach {url.host}: {e}") from e

    retrieved_at = datetime.now(tz=UTC)
    if response.status_code == 204:
        return None
    if response.status_code != 200:
        raise CatalogueError(f"{url.host} answered {response.status_code}: {response.text[:200]}")

    media_type = response.headers.get("content-type", "").split(";")[0].strip()
    if "xml" not in media_type:
        # INGV answers an unknown `format` with 200 and XML; the converse would be just as quiet.
        raise CatalogueError(f"expected QuakeML from {url.host}, got {media_type or 'nothing'}")

    return Fetched(
        document=response.content,
        request_url=str(url),
        retrieved_at=retrieved_at,
        media_type=media_type,
    )
