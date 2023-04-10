import uuid
from typing import List
from pydantic import BaseModel, Field

# Query Model is used to validate and parse the request body for POST /query endpoint
class Query(BaseModel):
  prompt: str

# Prompt Model is used to validate and parse the request body for POST /prompt endpoint
class Prompt(BaseModel):
  city: str = Field(description="name of a city")

class CityAqiInfo(BaseModel):
  id: uuid.UUID = Field(description="unique id")
  city: str = Field(description="name of the city")
  aqi: int = Field(description="air quality index of the city")
  color: str = Field(description="color of the AQI scale region of the city")

# This model is used to validate and parse the response body for POST /query endpoint
class CityAqiResponse(BaseModel):
  data: List[CityAqiInfo]
  answer: str