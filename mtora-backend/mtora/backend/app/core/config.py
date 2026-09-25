from typing import Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    DATABASE_URL: str = "sqlite:///./mtora.db"
    APP_ENV: str = "development"
    API_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Mtora Business Management API"
    VERSION: str = "0.1.0"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, v: Optional[str]) -> str:
        if not v:
            return "sqlite:///./mtora.db"
        
        # Handle Supabase and Heroku style connection strings
        # Convert postgres:// or postgresql:// to postgresql+psycopg:// for SQLAlchemy 2.x
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql+psycopg://", 1)
        if v.startswith("postgresql://") and not v.startswith("postgresql+"):
            return v.replace("postgresql://", "postgresql+psycopg://", 1)
        return v


settings = Settings()
