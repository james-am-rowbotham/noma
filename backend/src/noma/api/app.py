"""Noma's API. See ADR-0003.

Deliberately empty of data for now: the first endpoint that serves earthquakes needs somewhere real
to read them from, and serving the test fixture as though it were live would present a stored file
as a current observation — the thing Noma exists not to do.

Run from backend/:  uv run uvicorn noma.api.app:app --reload
"""

from fastapi import FastAPI

app = FastAPI(
    title="Noma",
    summary="An interface for exploring complex physical systems.",
    version="0.1.0",
)


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}
