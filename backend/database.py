from sqlalchemy.orm import DeclarativeBase
import os
from collections.abc import AsyncGenerator
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# Load backend/.env by explicit path so DATABASE_URL works regardless of CWD.
# Exported env vars still take precedence (load_dotenv never overrides them).
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

# Query params understood by libpq (psycopg) but not by asyncpg.connect().
# asyncpg receives SQLAlchemy query params as connect() kwargs, so an unknown
# key like channel_binding raises TypeError at connect time. sslmode is
# translated to asyncpg's `ssl` kwarg instead (asyncpg parses the same
# require/prefer/verify-full values there).
_LIBPQ_ONLY_PARAMS = frozenset({"channel_binding"})


def normalize_database_url(url: str) -> str:
    """Normalize DATABASE_URL for the asyncpg driver.

    Managed providers hand out libpq-style URLs (`postgres://` from Render,
    `postgresql://...?sslmode=require&channel_binding=require` from Neon),
    but this app only ships asyncpg. SQLAlchemy 2.x maps a bare
    `postgresql://` to psycopg, which is not installed, so without this the
    import-time engine creation fails with `No module named 'psycopg'`.
    """
    if url.startswith("postgres://"):
        url = "postgresql+asyncpg://" + url[len("postgres://") :]
    elif url.startswith("postgresql://"):
        url = "postgresql+asyncpg://" + url[len("postgresql://") :]

    scheme, netloc, path, query, fragment = urlsplit(url)
    if not query:
        return url
    params = parse_qsl(query, keep_blank_values=True)
    normalized: list[tuple[str, str]] = []
    has_ssl = any(key == "ssl" for key, _ in params)
    for key, value in params:
        if key in _LIBPQ_ONLY_PARAMS:
            continue
        if key == "sslmode":
            if not has_ssl:
                normalized.append(("ssl", value))
            continue
        normalized.append((key, value))
    return urlunsplit((scheme, netloc, path, urlencode(normalized), fragment))


# 1. Update with your real database credentials
# Format: postgresql+asyncpg://user:password@host:port/dbname
# (Render/Neon libpq URLs are normalized above.)
DATABASE_URL = normalize_database_url(
    os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://postgres:postgres@localhost:5432/myapp_db",
    )
)

# 2. Create the Async Engine
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Logs SQL statements to the console (set False in prod)
    pool_size=10,  # Max permanent database connections to keep open
    max_overflow=20,  # Extra temporary connections under heavy load
)

# 3. Create the Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,  # Prevents async validation errors after a commit
    class_=AsyncSession,
)

# 4. Injected dependency for FastAPI routes
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

# 5. Create the Base class for models
class Base(DeclarativeBase):
    pass