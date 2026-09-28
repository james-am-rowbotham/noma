"""Configuration, from environment variables prefixed NOMA_. See ADR-0004.

The default database URL is the LOCAL development database from docker-compose.yml — localhost only,
with a throwaway password. Anywhere else sets NOMA_DATABASE_URL, and if it forgets, the default
points at a database that is not there, so it fails loudly rather than quietly.
"""

from functools import cache

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="NOMA_", env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://noma:noma@localhost:5433/noma"

    #: Browser origins allowed to call this API. The local Vite dev server by default; a deployment
    #: sets NOMA_ALLOWED_ORIGINS to its own. Never "*" — that would let any page on the web read a
    #: Noma instance through a signed-in person's browser.
    allowed_origins: list[str] = ["http://localhost:5173", "http://localhost:5174"]

    #: TypeSafe's Jev, which turns computed facts into a typed verdict for monitors.
    #:
    #: SecretStr, not str: everything else here is safe in a log line and this is not. It masks
    #: itself in reprs, tracebacks and `model_dump()`, so reaching the real value takes an explicit
    #: `.get_secret_value()` — which is also the line a reader can grep for.
    #:
    #: None by default, and it stays None on a fresh checkout. Whatever needs it fails then and
    #: says so, rather than this file inventing a placeholder that gets a 401 from the far end.
    #: The environment name is NOMA_JEV_API_KEY: the prefix is this class's, not the vendor's, and
    #: an unprefixed JEV_API_KEY is silently ignored (`extra="ignore"` above).
    jev_api_key: SecretStr | None = None


@cache
def settings() -> Settings:
    return Settings()
