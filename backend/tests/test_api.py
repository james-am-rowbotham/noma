from fastapi.testclient import TestClient

from noma.api.app import app
from noma.domain.quake import Origin

client = TestClient(app)


def test_it_answers():
    assert client.get("/health").json() == {"status": "ok"}


def test_it_publishes_openapi():
    # The browser's TypeScript types are generated from this (ADR-0003).
    assert client.get("/openapi.json").json()["info"]["title"] == "Noma"


def test_domain_schemas_use_quakemls_names():
    # When an endpoint returns an Origin, this is what OpenAPI — and so the browser — will see.
    fields = set(Origin.model_json_schema(by_alias=True)["properties"])
    assert {"publicID", "eventID", "depthType", "creationTime"} <= fields
    assert not {"public_id", "event_id"} & fields
