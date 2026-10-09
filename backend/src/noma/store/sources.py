"""What Noma knows about its own asking. See ADR-0004.

FRESHNESS IS TWO QUESTIONS AND THEY HAVE DIFFERENT ANSWERS. Keeping them in one function is how a
monitor ends up reporting a volcano as quiet when what actually happened is that nobody asked.

  - **When did a reading last arrive?** For a sampled feed — a daily GNSS position, a satellite
    pass — compared against the stream's expected cadence. That lives in
    `noma.store.series.last_observed`, because it is a fact about observations.
  - **When did Noma last manage to ask?** For an event feed — earthquakes — where there is no
    rhythm to be late against. A week with no earthquakes is a quiet week; a week without asking
    is Noma being broken. Both look identical from the outside, which is the whole point.

The second one is answered here, and the distinction below is not cosmetic: `last_received` and
`last_asked` disagree by design.
"""

from datetime import datetime

from sqlalchemy import Connection, text


def last_received(connection: Connection, source_id: str) -> datetime | None:
    """When a document from this source last arrived.

    Read from `raw_document` rather than from a table of its own: the stored document IS the record
    of a successful fetch (domain-model point 8).

    NOT the same as "when did Noma last ask". An agency that answers HTTP 204 — INGV does, for
    anywhere outside Italy — gives Noma nothing to store, so a run of empty answers leaves this
    value standing still while Noma is in fact asking diligently. Use it to answer "how old is the
    newest thing we hold", never "are we still trying".
    """
    return connection.execute(
        text("SELECT max(retrieved_at) FROM raw_document WHERE source_id = :source_id"),
        {"source_id": source_id},
    ).scalar_one_or_none()


def last_asked(connection: Connection, source_id: str) -> datetime | None:
    """When Noma last put a question to this source's event service and got an answer of any kind,
    **including an empty one**.

    This is the honest freshness for a feed of things that HAPPEN. `event_fetch` records every ask
    with the area, the window and whether anything was found (migration 28e4a8fd1690), so an empty
    catalogue and an unasked one are already distinguishable in the data — this is the query that
    makes the distinction visible.

    None means Noma has never asked this source for events. That includes every source with no
    event service at all, such as NASA's thermal feed, and a reader must not read it as "asked, and
    nothing came back".
    """
    return connection.execute(
        text("SELECT max(fetched_at) FROM event_fetch WHERE source_id = :source_id"),
        {"source_id": source_id},
    ).scalar_one_or_none()
