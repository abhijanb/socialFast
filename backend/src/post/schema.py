from pydantic import BaseModel


class PostOut(BaseModel):
    id: int
    text: str
    title: str | None = None
    image: str | None = None
    user_id: int
