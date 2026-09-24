"""Noma's API. See ADR-0003.

Run from backend/:  uv run uvicorn noma.api.app:app --reload
Interactive docs:   http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from noma.api.earthquakes import router as earthquakes
from noma.api.section import router as section
from noma.settings import settings

app = FastAPI(
    title="Noma",
    summary="An interface for exploring complex physical systems.",
    version="0.1.0",
)


# The browser is served from a different port in development and will be a different origin in
# production, so it needs explicit permission. Named origins, never "*".
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings().allowed_origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(earthquakes)
app.include_router(section)


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}
