# AirAI : a GPT-powered air quality website that allows users to ask questions about air quality in different cities and receive answers in real-time. The website should display visual indicators of air quality for each city mentioned in the user’s query

## Stack

React with Typescript for Frontend
LangChain with FastAPI Python framework for Backend

### Setup Instructions

#### For Backend

Setup a virtual environment and install the requirements.txt file

```python
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi
pip install "uvicorn[standard]"
pip freeze > requirements.txt
uvicorn main:app --reload
pip install -r requirements.txt
```

#### For Frontend

```javascript
npm create vite@latest
//: # (select react with typescript)
npm i
npm run dev
```
