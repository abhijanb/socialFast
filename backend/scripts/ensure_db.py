"""Ensure the database from DATABASE_URL exists, then run Alembic migrations.

Usage (from repo root):
    venv/bin/python backend/scripts/ensure_db.py

    
Postgres cannot connect to a database that does not exist, and neither
SQLAlchemy nor Alembic creates databases (they only manage tables inside
one). So this script connects to the `postgres` maintenance database,
creates the target database if missing, then runs `alembic upgrade head`.

The database name is parsed out of DATABASE_URL -- never hardcoded here.
"""

import asyncio
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from database import DATABASE_URL  # noqa: E402 -- needs sys.path above

MAINTENANCE_DB = "postgres"
DB_NAME_PATTERN = re.compile(r"^[A-Za-z_][A-Za-z0-9_$]*$")


def parse_database_url(url: str) -> tuple[str, dict]:
    """Split DATABASE_URL into target db name + asyncpg connect kwargs."""
    parsed = urlparse(url)
    target_db = parsed.path.lstrip("/")
    if not target_db or not DB_NAME_PATTERN.match(target_db):
        raise ValueError(f"Cannot determine a safe database name from {url!r}")
    connect_kwargs = {
        "user": parsed.username,
        "password": parsed.password,
        "host": parsed.hostname or "localhost",
        "port": parsed.port or 5432,
        "database": MAINTENANCE_DB,
    }
    return target_db, connect_kwargs


async def ensure_database_exists(target_db: str, connect_kwargs: dict) -> None:
    import asyncpg

    conn = await asyncpg.connect(**connect_kwargs)
    try:
        exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1", target_db
        )
        if exists:
            print(f"Database {target_db!r} already exists.")
            return
        # Quoted identifier + pre-validated name: no injection risk.
        await conn.execute(f'CREATE DATABASE "{target_db}"')
        print(f"Created database {target_db!r}.")
    finally:
        await conn.close()


def run_migrations() -> None:
    subprocess.run(
        [sys.executable, "-m", "alembic", "-c", "alembic.ini", "upgrade", "head"],
        cwd=BACKEND_DIR,
        check=True,
    )


async def main() -> None:
    target_db, connect_kwargs = parse_database_url(DATABASE_URL)
    print(f"DATABASE_URL targets database {target_db!r}.")
    if target_db == MAINTENANCE_DB:
        print("Target is the maintenance database; skipping creation.")
    else:
        await ensure_database_exists(target_db, connect_kwargs)
    run_migrations()


if __name__ == "__main__":
    asyncio.run(main())
