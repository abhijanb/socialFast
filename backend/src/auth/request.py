from models import User
from sqlalchemy.ext.asyncio import AsyncSession

async def saveUser(user: User, db: AsyncSession) -> User:
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
