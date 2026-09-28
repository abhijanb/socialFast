import pytest
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models import Like, Post, User


async def _user_with_post(db_session: AsyncSession) -> tuple[User, Post]:
    user = User(username="liker", email="liker@example.com", password_hash="x")
    db_session.add(user)
    await db_session.flush()
    post = Post(text="hello", user_id=user.id)
    db_session.add(post)
    await db_session.commit()
    await db_session.refresh(user)
    await db_session.refresh(post)
    return user, post


async def test_like_links_user_and_post(db_session: AsyncSession):
    user, post = await _user_with_post(db_session)

    db_session.add(Like(user_id=user.id, post_id=post.id))
    await db_session.commit()

    # Async sessions can't lazy-load relationships, so eager-load them and
    # query the collections explicitly instead of touching user.likes.
    like = (
        await db_session.execute(
            select(Like).options(selectinload(Like.user), selectinload(Like.post))
        )
    ).scalar_one()
    assert like.user_id == user.id
    assert like.post_id == post.id
    assert like.user.id == user.id
    assert like.post.id == post.id
    user_likes = (
        await db_session.execute(select(Like).where(Like.user_id == user.id))
    ).scalars().all()
    post_likes = (
        await db_session.execute(select(Like).where(Like.post_id == post.id))
    ).scalars().all()
    assert [row.id for row in user_likes] == [like.id]
    assert [row.id for row in post_likes] == [like.id]


async def test_like_rejects_duplicate_user_post(db_session: AsyncSession):
    user, post = await _user_with_post(db_session)

    db_session.add(Like(user_id=user.id, post_id=post.id))
    await db_session.commit()

    db_session.add(Like(user_id=user.id, post_id=post.id))
    with pytest.raises(IntegrityError):
        await db_session.commit()


async def test_like_deleted_with_post(db_session: AsyncSession):
    user, post = await _user_with_post(db_session)

    db_session.add(Like(user_id=user.id, post_id=post.id))
    await db_session.commit()

    await db_session.delete(post)
    await db_session.commit()

    assert (await db_session.execute(select(Like))).scalars().all() == []
