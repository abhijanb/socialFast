from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from models import Post, User


async def _seed(db_session: AsyncSession, n: int) -> list[Post]:
    user = User(username="pager", email="pager@example.com", password_hash="x")
    db_session.add(user)
    await db_session.flush()
    posts = [Post(text=f"post {i}", user_id=user.id) for i in range(n)]
    db_session.add_all(posts)
    await db_session.commit()
    for post in posts:
        await db_session.refresh(post)
    return posts


def test_index_empty(client: TestClient):
    response = client.get("/post/")
    assert response.status_code == 200
    assert response.json() == {"items": [], "next_cursor": None}


async def test_index_paginates(client: TestClient, db_session: AsyncSession):
    await _seed(db_session, 3)

    first = client.get("/post/", params={"limit": 2})
    assert first.status_code == 200
    body = first.json()
    assert [item["text"] for item in body["items"]] == ["post 2", "post 1"]
    assert body["next_cursor"] is not None

    second = client.get("/post/", params={"limit": 2, "cursor": body["next_cursor"]})
    assert second.status_code == 200
    body2 = second.json()
    assert [item["text"] for item in body2["items"]] == ["post 0"]
    assert body2["next_cursor"] is None


def test_index_rejects_bad_params(client: TestClient):
    assert client.get("/post/", params={"limit": 0}).status_code == 422
    assert client.get("/post/", params={"limit": 101}).status_code == 422
    assert client.get("/post/", params={"cursor": 0}).status_code == 422
