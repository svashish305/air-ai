from pydantic import BaseModel, Field

class Query(BaseModel):
  prompt: str

class Prompt(BaseModel):
  city: str = Field(description="name of a city")