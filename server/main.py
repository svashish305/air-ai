from functools import lru_cache
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from models import Query
from utils import parse_user_prompt, get_aqi_response_from_city_data

app = FastAPI()

origins = [
  "http://localhost:5173",
  "https://cosmic-torrone-3174f0.netlify.app"
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@lru_cache()
def get_settings():
  return settings

@app.get("/", name="root", summary="Health Check")
def read_root():
  return {"Hello": "World"}


@app.post("/query", name="query", summary="Query AQI Data")
async def query(query: Query):
  try:
    response = None
    user_prompt = query.prompt
    print("received prompt: ", user_prompt)

    parsed_prompt_data = parse_user_prompt(user_prompt)
    print("parsed_prompt: ", parsed_prompt_data.get("parsed_prompt"))

    aqi_response = get_aqi_response_from_city_data(parsed_prompt_data.get("city_info"))
    print("aqi_data response: ", aqi_response)

    response = {
      "cityAqiData": aqi_response.get("city_aqi_data"),
      "answer": aqi_response.get("response"),
    } 
    return {"data": response}
  except Exception as e:
    print("error: ", e)
    return {"error": str(e)}