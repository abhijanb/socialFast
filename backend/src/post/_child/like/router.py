from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Like, Post, User
from src.auth.deps import get_current_user

likeRouter = APIRouter(prefix="/like", tags=["like"])


class LikeOut(BaseModel):
    id: int
    user_id: int
    post_id: int


@likeRouter.post("/{post_id}", response_model=LikeOut, status_code=status.HTTP_201_CREATED)
async def likePost(
    post_id: Annotated[int, Path(ge=1)],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> LikeOut:
    # Liking a missing post is a 404, not a like row pointing nowhere.
    post = await db.get(Post, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    like = Like(user_id=current_user.id, post_id=post_id)  # Increment likes_count when a like is added
    try:
        db.add(like)
        post.likes_count += 1
        await db.commit()
        await db.refresh(like)
    except IntegrityError as e:
        # uq_likes_user_post: this user already liked this post.
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already liked") from e
    return LikeOut(id=like.id, user_id=like.user_id, post_id=like.post_id)

@likeRouter.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unlikePost(
    post_id: Annotated[int, Path(ge=1)],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    # Like PK is `id`, so look up by the (user_id, post_id) unique pair.
    like = (
        await db.execute(
            select(Like).where(Like.user_id == current_user.id, Like.post_id == post_id)
        )
    ).scalar_one_or_none()
    if like is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Like not found")
    await db.delete(like)
    # Decrement likes_count when a like is removed
    post = await db.get(Post, post_id)
    if post is not None and post.likes_count > 0:
        post.likes_count -= 1
    await db.commit()
