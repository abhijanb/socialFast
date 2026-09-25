import jwt

from config import Settings
from helper import hash_password

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import User
from src.auth.query import getUserByEmail
from src.auth.request import saveUser
from src.auth.schema import RegisterIn, RegisterOut
from src.auth.schema import LoginIn, LoginOut

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=RegisterOut, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterIn, db: AsyncSession = Depends(get_db)) -> RegisterOut:
    
    existing = await getUserByEmail(body.email, db)
    if existing is not None:
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(username=body.username, email=body.email, password_hash=hash_password(body.password))
    user = await saveUser(user, db)
    return RegisterOut(id=user.id, username=user.username, email=user.email)

@router.post("/login", response_model=LoginOut, status_code=status.HTTP_200_OK)
async def login(body: LoginIn, db: AsyncSession = Depends(get_db))-> LoginOut:
    # Implement login logic here
    user = await getUserByEmail(body.email, db)
    if user is None or user.password_hash != hash_password(body.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    jwt_token: str  = jwt.encode({"user_id": user.id}, Settings.secret_key, algorithm="HS256")
    return LoginOut(message="Login successful", user=RegisterOut(id=user.id, username=user.username, email=user.email))



