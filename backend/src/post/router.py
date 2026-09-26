from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Post, User
from src.auth.deps import get_current_user
from src.storage.uploads import save_upload


postRouter = APIRouter(prefix="/post", tags=["post"])

MAX_IMAGE_BYTES = 5 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


class PostOut(BaseModel):
    id: int
    text: str
    title: str | None = None
    image: str | None = None
    user_id: int



@postRouter.post("/", response_model=PostOut, status_code=status.HTTP_201_CREATED)
async def store(
    text: Annotated[str, Form(min_length=1, max_length=255)],
    title: Annotated[str | None, Form(max_length=255)] = None,
    image: Annotated[UploadFile | None, File()] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    image_path: str | None = None
    if image is not None:
        # Stored in DB (String(255)); served via StaticFiles mount at /uploads.
        image_path = await save_upload(
            image,
            subdir="posts",
            allowed_content_types=ALLOWED_CONTENT_TYPES,
            allowed_extensions=ALLOWED_EXTENSIONS,
            max_bytes=MAX_IMAGE_BYTES,
        )
    post = Post(text=text, title=title, image=image_path, user_id=current_user.id)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return PostOut(id=post.id, text=post.text, title=post.title, image=post.image, user_id=post.user_id)

