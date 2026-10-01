from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from helper import create_access_token
from models import Post, User


async def _user_with_post(db_session: AsyncSession) -> tuple[User, Post]:
    user = User(username="fan", email="fan@example.com", password_hash="x")
    db_session.add(user)
    await db_session.flush()
    post = Post(text="likeable", user_id=user.id)
    db_session.add(post)
    await db_session.commit()
    await db_session.refresh(user)
    await db_session.refresh(post)
    return user, post


def _login(client: TestClient, user: User) -> None:
    token = create_access_token({"user_id": user.id}, expires_in_seconds=settings.expiration_time)
    client.cookies.set("access_token", token)


async def test_like_happy_path(client: TestClient, db_session: AsyncSession):
    user, post = await _user_with_post(db_session)
    _login(client, user)

    r = client.post(f"/like/{post.id}")

    assert r.status_code == 201
    assert r.json() == {"id": r.json()["id"], "user_id": user.id, "post_id": post.id}
    assert isinstance(r.json()["id"], int)


async def test_like_missing_post(client: TestClient, db_session: AsyncSession):
    user, _ = await _user_with_post(db_session)
    _login(client, user)

    r = client.post("/like/9999")

    assert r.status_code == 404
    assert r.json()["detail"] == "Post not found"


async def test_like_duplicate_is_conflict(client: TestClient, db_session: AsyncSession):
    user, post = await _user_with_post(db_session)
    _login(client, user)

    assert client.post(f"/like/{post.id}").status_code == 201

    r = client.post(f"/like/{post.id}")

    assert r.status_code == 409
    assert r.json()["detail"] == "Already liked"


async def test_like_requires_auth(client: TestClient, db_session: AsyncSession):
    _, post = await _user_with_post(db_session)

    r = client.post(f"/like/{post.id}")

    assert r.status_code == 401


async def test_like_rejects_bad_post_id(client: TestClient, db_session: AsyncSession):
    user, _ = await _user_with_post(db_session)
    _login(client, user)

    assert client.post("/like/0").status_code == 422
