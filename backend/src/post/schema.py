from pydantic import BaseModel


class PostOut(BaseModel):
    id: int
    text: str
    title: str | None = None
    image: str | None = None
    user_id: int
    likes: int = 0
    liked_by_user: bool = False
    username: str | None = None


class PostPageOut(BaseModel):
    items: list[PostOut]
    next_cursor: int | None = None
