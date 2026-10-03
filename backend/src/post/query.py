from models import User
from models import Like
from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models import Post

async def get_posts_page(
    db: AsyncSession,
    *,
    user_id: int,
    cursor: int | None,
    limit: int,
) -> tuple[Sequence[tuple[Post, str]], set[int], int | None]:

    stmt = (
        select(Post, User.username)
        .join(User, User.id == Post.user_id)
        .order_by(Post.id.desc())
        .limit(limit + 1)
    )

    if cursor is not None:
        stmt = stmt.where(Post.id < cursor)

    rows = (await db.execute(stmt)).all()

    page = rows[:limit]

    post_ids = [post.id for post, username in page]

    like_stmt = select(Like.post_id).where(
        Like.user_id == user_id,
        Like.post_id.in_(post_ids),
    )

    liked_post_ids = set(
        (await db.execute(like_stmt)).scalars().all()
    )

    next_cursor = ( 
        page[-1][0].id
        if len(rows) > limit
        else None
    )

    return page, liked_post_ids, next_cursor