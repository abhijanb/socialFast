from typing import Annotated

from config import settings
from helper import clear_access_cookie, create_access_token, hash_password, set_access_cookie, verify_password

from fastapi import APIRouter, Depends, File, Form, HTTPException, Response, UploadFile, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import User
from src.auth.deps import get_current_user
from src.auth.query import getUserByEmail, getUserByUsername
from src.auth.request import saveUser
from src.auth.schema import  RegisterOut
from src.auth.schema import LoginIn, LoginOut
from src.storage.uploads import save_upload

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=RegisterOut, status_code=status.HTTP_201_CREATED)
async def register(email:Annotated[str, Form( min_length=1, max_length=255 )],
                   username: Annotated[str, Form( min_length=1, max_length=50 )],
                   password: Annotated[str, Form( min_length=1, max_length=255 )],
                   avatar: Annotated[UploadFile | None, File()] = None,
                   db: AsyncSession = Depends(get_db)) -> RegisterOut:
    
    existing = await getUserByEmail(email, db)
    if existing is not None:
        raise HTTPException(status_code=400, detail="User already exists")

    if await getUserByUsername(username, db) is not None:
        raise HTTPException(status_code=400, detail="Username already taken")

    avatar_path = None
    if avatar is not None:
        # Process the uploaded avatar file
        avatar_path = await save_upload(
            avatar,
            subdir="avatars",
            allowed_content_types={"image"},
            allowed_extensions={".jpg", ".jpeg", ".png", ".webp"},
            max_bytes=5 * 1024 * 1024,  # 5 MB
        )

    user = User(username=username, email=email, password_hash=hash_password(password), avatar=avatar_path)
    try:
        user = await saveUser(user, db)
    except IntegrityError:
        # Check-then-insert race (or drifted data): unique violation anyway.
        await db.rollback()
        raise HTTPException(status_code=400, detail="User already exists")
    return RegisterOut(id=user.id, username=user.username, email=user.email)

@router.post("/login", response_model=LoginOut, status_code=status.HTTP_200_OK)
async def login(body: LoginIn, response: Response, db: AsyncSession = Depends(get_db))-> LoginOut:
    # Implement login logic here
    user = await getUserByEmail(body.email, db)
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    jwt_token: str = create_access_token({"user_id": user.id}, expires_in_seconds=settings.expiration_time)

    set_access_cookie(response, key="access_token", value=jwt_token)

    return LoginOut(message="Login successful", user=RegisterOut(id=user.id, username=user.username, email=user.email))


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(response: Response):
    clear_access_cookie(response, key="access_token")
    return {"message": "Logged out"}


@router.get("/me", response_model=RegisterOut, status_code=status.HTTP_200_OK)
async def me(user: User = Depends(get_current_user)) -> RegisterOut:
    return RegisterOut(id=user.id, username=user.username, email=user.email)



