"""Noma's API. See ADR-0003.

Run from backend/:  uv run uvicorn noma.api.app:app --reload
Interactive docs:   http://localhost:8000/docs
"""

from fastapi import FastAPI

from noma.api.earthquakes import router as earthquakes

app = FastAPI(
    title="Noma",
    summary="An interface for exploring complex physical systems.",
    version="0.1.0",
)


app.include_router(earthquakes)


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}
