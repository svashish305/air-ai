from pydantic import BaseSettings


class Settings(BaseSettings):
  app_name: str = "AIR AI API"
  OPENAI_API_KEY: str
  SERPAPI_API_KEY: str

  class Config:
    env_file = ".env"


settings = Settings()