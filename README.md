# AirAI

A GPT-powered air quality website that allows users to ask questions about air quality in different cities and receive answers in real-time. The website should display visual indicators of air quality for each city mentioned in the user’s query

## Tech Stack Used

LangChain with FastAPI for Backend, deployed on deta.space [here](https://server-1-k7259360.deta.app/).
\
React with Typescript and SCSS for Frontend, deployed on netlify [here](https://cosmic-torrone-3174f0.netlify.app/).

### Setup Instructions

#### For Backend

Setup a virtual environment and install the requirements.txt file

```python
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
# in case of updating dependencies, after updates, run below command to update requirements.txt
pip freeze > requirements.txt
```

[API Docs](https://server-1-k7259360.deta.app/docs)
\
[Alternate Interactive API Docs](https://server-1-k7259360.deta.app/redoc)

#### For Frontend

```javascript
npm create vite@latest
// select react and typescript, then cd into the directory
npm i
npm run dev
```
