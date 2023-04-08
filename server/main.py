import os
import json
from functools import lru_cache
from dotenv import load_dotenv

from fastapi import FastAPI, Request
from config import settings
from fastapi.middleware.cors import CORSMiddleware

from langchain.llms import OpenAI
from langchain.agents import (load_tools, initialize_agent, AgentType)

load_dotenv()

app = FastAPI()

@lru_cache()
def get_settings():
    return settings

origins = [
    "http://localhost:5173",
    "https://cosmic-torrone-3174f0.netlify.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "world"}

@app.post("/query")
async def query(req: Request):
    try:
        req_body = await req.json()
        prompt = req_body.get("prompt", "")
        print("received prompt: ", prompt)

        llm = OpenAI(temperature=0, openai_api_key=settings.OPENAI_API_KEY)
        tools = load_tools(["serpapi", "llm-math"], llm=llm)
        agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)
        response = agent.run(prompt)
        return {"data": response}
    except Exception as e:
        print("error: ", str(e))
        return {"error": str(e)}