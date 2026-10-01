from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Post, User
from src.auth.deps import get_current_user
from src.post.query import getPostsPage
from src.post.request import savePost
from src.post.schema import PostOut, PostPageOut
from src.storage.uploads import save_upload


postRouter = APIRouter(prefix="/post", tags=["post"])

MAX_IMAGE_BYTES = 5 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@postRouter.post("/", response_model=PostOut, status_code=status.HTTP_201_CREATED)
async def store(
    text: Annotated[str, Form(min_length=1, max_length=255)],
    title: Annotated[str | None, Form(max_length=255)] = None,
    image: Annotated[UploadFile | None, File()] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PostOut:
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
    post: Post = Post(text=text, title=title, image=image_path, user_id=current_user.id)
    try:
        post = await savePost(post, db)
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create post") from e
    return PostOut(id=post.id, text=post.text, title=post.title, image=post.image, user_id=post.user_id)

@postRouter.get("/", response_model=PostPageOut)
async def index(
    db: AsyncSession = Depends(get_db),
    cursor: Annotated[int | None, Query(ge=1)] = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> PostPageOut:
    posts, next_cursor = await getPostsPage(db, cursor=cursor, limit=limit)
    return PostPageOut(
            items=[
                PostOut(id=post.id, text=post.text, title=post.title, image=post.image, user_id=post.user_id, likes=post.likes_count)
            for post in posts
        ],
        next_cursor=next_cursor,
    )