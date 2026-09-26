import asyncio
import os
import sys
from collections.abc import AsyncGenerator, Generator
from pathlib import Path
from urllib.parse import urlparse

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

# Ensure backend/ is importable (config, database, models, src.*)
# regardless of where pytest is invoked from.
# REUSE: change parents[N] so "up N levels" lands on the folder holding your
# code, e.g. shop/tests/conftest.py -> parents[1]; shop/tests/unit/conftest.py -> parents[2].
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

# REUSE SCOPE: portable as-is between async-SQLAlchemy + postgres + FastAPI
# projects. Needs surgery if the other project uses sync SQLAlchemy
# (drop asyncio.run wrappers), a non-postgres DB (rewrite _ensure_database),
# or a non-FastAPI framework (rewrite the client fixture).

# REUSE: point at the other project's modules, e.g. from shop.db import get_db
from database import get_db  # noqa: E402
# REUSE: point at the other project's models, e.g. from shop.models import Base
from models import Base  # noqa: E402

# REUSE: change the default DB name/creds, e.g. .../shop_test.
# Overridable per run via the TEST_DATABASE_URL env var (no edit needed for that).
TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/socialfast_test",
)


def _db_name(url: str) -> str:
    return urlparse(url).path.lstrip("/")


def _admin_url(url: str) -> str:
    """Same server, but pointing at the maintenance 'postgres' database."""
    parsed = urlparse(url)
    return parsed._replace(path="/postgres").geturl()


def _ensure_database() -> None:
    async def _go() -> None:
        admin = create_async_engine(_admin_url(TEST_DATABASE_URL), isolation_level="AUTOCOMMIT")
        async with admin.connect() as conn:
            name = _db_name(TEST_DATABASE_URL)
            exists = (
                await conn.execute(
                    text("SELECT 1 FROM pg_database WHERE datname = :name"), {"name": name}
                )
            ).scalar()
            if not exists:
                await conn.execute(text(f'CREATE DATABASE "{name}"'))
        await admin.dispose()

    asyncio.run(_go())


@pytest.fixture(scope="session")
def _db() -> Generator[AsyncEngine, None, None]:
    """Test engine with a clean schema. Database is auto-created if missing."""
    _ensure_database()
    # NullPool: each use opens a fresh connection in the current event loop,
    # so the engine is safe to share across TestClient portal / test loops.
    engine = create_async_engine(TEST_DATABASE_URL, poolclass=NullPool)

    async def _create() -> None:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)

    async def _drop() -> None:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)

    asyncio.run(_create())
    yield engine
    asyncio.run(_drop())
    asyncio.run(engine.dispose())


def _session_factory(engine: AsyncEngine) -> async_sessionmaker[AsyncSession]:
    return async_sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)


@pytest.fixture()
async def db_session(_db: AsyncEngine) -> AsyncGenerator[AsyncSession, None]:
    async with _session_factory(_db)() as session:
        yield session


@pytest.fixture(autouse=True)
def _clean(_db: AsyncEngine) -> Generator[None, None, None]:
    """Truncate tables before each test so unique constraints never leak across tests."""

    async def _go() -> None:
        async with _db.connect() as conn:
            # REUSE: list this project's tables,
            # e.g. TRUNCATE orders, customers RESTART IDENTITY CASCADE.
            await conn.execute(text("TRUNCATE users RESTART IDENTITY CASCADE"))
            await conn.commit()

    asyncio.run(_go())
    yield


@pytest.fixture()
def client(_db: AsyncEngine) -> Generator[TestClient, None, None]:
    # REUSE: point at the other project's app, e.g. from shop.main import app
    from main import app

    async def override() -> AsyncGenerator[AsyncSession, None]:
        async with _session_factory(_db)() as session:
            yield session

    # REUSE: use this project's session dependency name, e.g. dependency_overrides[get_session].
    app.dependency_overrides[get_db] = override
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
