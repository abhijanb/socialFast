from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
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

# Browser blocks cross-origin calls without CORS headers. Frontend runs on
# settings.frontend_url (http://localhost:3000) and uses credentials:"include",
# so origins must be explicit (never "*") with allow_credentials=True.
allow_origins = [settings.frontend_url]
if "localhost" in settings.frontend_url:
    loopback_alias = settings.frontend_url.replace("localhost", "127.0.0.1")
    if loopback_alias not in allow_origins:
        allow_origins.append(loopback_alias)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)