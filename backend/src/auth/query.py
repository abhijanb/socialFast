from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import User
async def getUserByEmail(email: str, db: AsyncSession) -> User | None:
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def getUserById(user_id: int, db: AsyncSession) -> User | None:
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()