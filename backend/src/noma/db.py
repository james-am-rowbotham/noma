"""The database connection. See ADR-0004.

SQLAlchemy 2 in its Core style — queries written against tables, not an object-relational mapper.
Noma's domain models (noma.domain) stay Pydantic and know nothing about the database; converting
between the two happens in one place per record type, not across the codebase.
"""

from functools import cache

from sqlalchemy import Engine, create_engine

from noma.settings import settings


@cache
def engine() -> Engine:
    # pool_pre_ping: a connection dropped while idle is replaced rather than failing a request.
    return create_engine(settings().database_url, pool_pre_ping=True)
