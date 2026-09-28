from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Like, Post, User
from src.auth.deps import get_current_user

likeRouter= APIRouter(prefix="like")

class LikedOut(BaseModel):
    status_code: int
    details:str

@likeRouter.post("/add")
async def likePost(postId:int, db:AsyncSession = Depends(get_db), user:User = Depends(get_current_user)):
    # check if post exist
    postExist = await db.get(Post,postId)
    # if post doesnot exist return exxcption error
    if postExist is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    # add that post to like table
    liked = Like(user_id = user.id, post_id=postId)
    db.add(liked)
    await db.commit()
    return LikedOut(status_code = status.HTTP_201_CREATED,details="post liked successfully") 
