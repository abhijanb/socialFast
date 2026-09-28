from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models import Post


async def getPostsPage(
    db: AsyncSession, *, cursor: int | None, limit: int
) -> tuple[Sequence[Post], int | None]:
    """Newest-first page. `cursor` is the id of the last item on the previous page."""
    stmt = select(Post).order_by(Post.id.desc()).limit(limit + 1)
    if cursor is not None:
        stmt = stmt.where(Post.id < cursor)
    rows = (await db.execute(stmt)).scalars().all()
    page = rows[:limit]
    next_cursor = page[-1].id if len(rows) > limit else None
    return page, next_cursor
