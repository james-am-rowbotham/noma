"""Who a record came from — the W3C provenance standard's Agent (domain-model)."""

from noma.domain.quake import Model, SourceId


class Source(Model):
    id: SourceId
    name: str
    #: Permanent identifier. ROR for an organisation; a person would carry an ORCID (CLAUDE.md).
    ror_id: str | None = None
    #: Decides what Noma may re-serve, and is not optional: INGV's data is CC-BY-4.0, so attribution
    #: is a legal requirement rather than a courtesy, and at least one volcanology database forbids
    #: redistribution outright (domain-model point 13).
    licence: str
