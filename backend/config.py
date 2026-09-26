from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }

    secret_key: str
    expiration_time: int
    frontend_url: str = "http://localhost:3000"

# Values are loaded from `.env` / environment at runtime by pydantic-settings,
# so no explicit constructor args are needed (the type checker can't see that).
settings = Settings()  # type: ignore[call-arg]