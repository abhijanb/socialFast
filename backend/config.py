from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }

    secret_key: str
    expiration_time: int