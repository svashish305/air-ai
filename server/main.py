import os
from functools import lru_cache

from typing import Union

from fastapi import Depends, FastAPI
from config import Settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@lru_cache()
def get_settings():
    settings = Settings()
    return settings

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root(settings: Settings = Depends(get_settings)):
    return {"Hello": "world"}