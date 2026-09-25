from contextlib import asynccontextmanager
from fastapi import FastAPI

from database import engine
from src.auth.router import router as auth_router

@asynccontextmanager
async def lifespan(app: FastAPI):
  # No startup work: schema is managed by Alembic (`alembic upgrade head`).
  yield
  # Close the engine's pooled connections so shutdown is clean.
  await engine.dispose()


# 2. Pass the lifespan to the FastAPI instance
app = FastAPI(lifespan=lifespan)
app.include_router(auth_router)