from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from fastapi import Response
from pwdlib import PasswordHash

from config import settings

_ph = PasswordHash.recommended()

_JWT_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return _ph.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return _ph.verify(password, password_hash)


def create_access_token(data: dict[str, Any], expires_in_seconds: int | None = None) -> str:
    """Encode a JWT. Caller passes payload + lifetime in seconds.

    Example: create_access_token({"user_id": user.id}, expires_in_seconds=3600)
    """
    if expires_in_seconds is None:
        expires_in_seconds = settings.expiration_time
    if expires_in_seconds <= 0:
        raise ValueError("expires_in_seconds must be positive")

    to_encode = data.copy()
    to_encode["exp"] = datetime.now(timezone.utc) + timedelta(seconds=expires_in_seconds)
    return jwt.encode(to_encode, settings.secret_key, algorithm=_JWT_ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode/verify a JWT. Raises jwt.ExpiredSignatureError if expired,
    jwt.InvalidTokenError if tampered/invalid. Let callers map these to 401."""
    return jwt.decode(token, settings.secret_key, algorithms=[_JWT_ALGORITHM])


def set_access_cookie(response: Response, key: str, value: str, expires_in_seconds: int | None = None) -> None:
    """Set auth cookie. Name comes from caller, policy from settings (env-overridable)."""
    if not key:
        raise ValueError("cookie key must not be empty")
    lifetime = expires_in_seconds if expires_in_seconds is not None else settings.expiration_time
    if lifetime <= 0:
        raise ValueError("expires_in_seconds must be positive")

    response.set_cookie(
        key=key,
        value=value,
        httponly=True,
        max_age=lifetime,
        expires=datetime.now(timezone.utc) + timedelta(seconds=lifetime),
        samesite=settings.cookie_samesite,  # type: ignore[arg-type]
        secure=settings.cookie_secure,
        path=settings.cookie_path,
    )


def clear_access_cookie(response: Response, key: str) -> None:
    """Clear auth cookie. Must match path/samesite/secure used when setting."""
    if not key:
        raise ValueError("cookie key must not be empty")

    response.delete_cookie(
        key=key,
        path=settings.cookie_path,
        samesite=settings.cookie_samesite,  # type: ignore[arg-type]
        secure=settings.cookie_secure,
    )
        