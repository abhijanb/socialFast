from sqlalchemy.ext.asyncio import AsyncSession

from models import Post


async def savePost(post: Post, db: AsyncSession) -> Post:
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post
