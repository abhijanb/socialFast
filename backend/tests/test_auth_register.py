from fastapi.testclient import TestClient
from httpx import Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from helper import verify_password
from models import User

VALID = {"username": "alice", "email": "alice@example.com", "password": "password123"}


def test_register_happy_path(client: TestClient):
    r: Response = client.post("/auth/register", json=VALID)

    assert r.status_code == 201
    body = r.json()
    assert body["username"] == VALID["username"]
    assert body["email"] == VALID["email"]
    assert isinstance(body["id"], int)
    assert "password" not in body
    assert "password_hash" not in body


async def test_register_hashes_password(client: TestClient, db_session: AsyncSession):
    client.post("/auth/register", json=VALID)

    user = (await db_session.execute(select(User).where(User.email == VALID["email"]))).scalar_one()
    assert user.password_hash != VALID["password"]
    assert verify_password(VALID["password"], user.password_hash)


def test_register_duplicate_email(client: TestClient):
    first: Response = client.post("/auth/register", json=VALID)
    assert first.status_code == 201

    r: Response = client.post("/auth/register", json={**VALID, "username": "othername"})

    assert r.status_code == 400
    assert r.json()["detail"] == "User already exists"


def test_register_duplicate_username(client: TestClient):
    first: Response = client.post("/auth/register", json=VALID)
    assert first.status_code == 201

    r: Response = client.post("/auth/register", json={**VALID, "email": "other@example.com"})

    assert r.status_code == 400
    assert r.json()["detail"] == "Username already taken"


def test_register_short_password(client: TestClient):
    r: Response = client.post("/auth/register", json={**VALID, "password": "short"})

    assert r.status_code == 422


def test_register_invalid_email(client: TestClient):
    r: Response = client.post("/auth/register", json={**VALID, "email": "not-an-email"})

    assert r.status_code == 422


def test_register_short_username(client: TestClient):
    r: Response = client.post("/auth/register", json={**VALID, "username": "ab"})

    assert r.status_code == 422
