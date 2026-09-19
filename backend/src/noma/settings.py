"""Configuration, from environment variables prefixed NOMA_. See ADR-0004.

The default database URL is the LOCAL development database from docker-compose.yml — localhost only,
with a throwaway password. Anywhere else sets NOMA_DATABASE_URL, and if it forgets, the default
points at a database that is not there, so it fails loudly rather than quietly.
"""

from functools import cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="NOMA_", env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://noma:noma@localhost:5433/noma"


@cache
def settings() -> Settings:
    return Settings()
