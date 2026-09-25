import os
from collections.abc import AsyncGenerator
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

# Load backend/.env by explicit path so DATABASE_URL works regardless of CWD.
# Exported env vars still take precedence (load_dotenv never overrides them).
load_dotenv(Path(__file__).resolve().parent / ".env")

# 1. Update with your real database credentials
# Format: postgresql+asyncpg://user:password@host:port/dbname
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://postgres:postgres@localhost:5432/myapp_db"
)

# 2. Create the Async Engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True,              # Logs SQL statements to the console (set False in prod)
    pool_size=10,           # Max permanent database connections to keep open
    max_overflow=20         # Extra temporary connections under heavy load
)

# 3. Create the Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False, # Prevents async validation errors after a commit
    class_=AsyncSession
)

class Base(DeclarativeBase):
    pass

# 4. Injected dependency for FastAPI routes
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
