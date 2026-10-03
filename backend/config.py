from pydantic_settings import BaseSettings,SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    secret_key: str
    database_url: str
    expiration_time: int
    frontend_url: str = "http://localhost:3000"
    cookie_samesite: str = "lax"
    cookie_secure: bool = False
    cookie_path: str = "/"
    upload_dir: str = "uploads"
    upload_max_bytes: int = 5 * 1024 * 1024
    upload_allowed_content_types: list[str] = ["image/jpeg", "image/png", "image/webp"]
    upload_allowed_extensions: list[str] = [".jpg", ".jpeg", ".png", ".webp"]

# Values are loaded from `.env` / environment at runtime by pydantic-settings,
# so no explicit constructor args are needed (the type checker can't see that).
settings = Settings()  # type: ignore[call-arg]