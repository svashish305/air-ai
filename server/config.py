from pydantic import BaseSettings

# Settings represents FastAPI App Configuration Settings
class Settings(BaseSettings):
  app_name: str = "AIR AI API"
  OPENAI_API_KEY: str
  WAQI_API_KEY: str

  class Config:
    env_file = ".env"


settings = Settings()