# built-in imports
import json
import uuid
import os
from dotenv import load_dotenv
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain.utilities import TextRequestsWrapper

# user defined imports
from models import Prompt

load_dotenv()

# constants
requests = TextRequestsWrapper()
model_name = 'text-davinci-003'
temperature = 0.0
openai_api_key = os.getenv("OPENAI_API_KEY")
waqi_api_key = os.getenv("WAQI_API_KEY") # Get Yours Here: https://aqicn.org/data-platform/token/

llm = OpenAI(model_name=model_name, temperature=temperature, openai_api_key=openai_api_key)

# helper functions
# This function parses a list of strings as readable string with commas and "and"
def parse_list_as_readable_string(list):
  list_length = len(list)
  phrase = None
  if list_length == 1:
    phrase = list[0]
  elif list_length == 2:
    phrase = " and ".join(list)
  else:
    phrase = ", ".join(list[:-1]) + " and " + list[-1]
  return phrase

# This function parses the user prompt and returns the city info and the parsed prompt
def parse_user_prompt(user_prompt):
  parser = PydanticOutputParser(pydantic_object=Prompt)
  prompt = PromptTemplate(
    template="Answer the user query.\n{format_instructions}\n{query}\n",
    input_variables=["query"],
    partial_variables={"format_instructions": parser.get_format_instructions()}
  )
  _input = prompt.format_prompt(query=user_prompt)
  output = llm(_input.to_string())
  city_info = json.loads(output).get("city")
  city_count = len(city_info) if type(city_info) == list else 1
  city_names = [city_info] if city_count == 1 else city_info
  city_phrase = parse_list_as_readable_string(city_names)
  parsed_prompt = f"What's the air quality of {city_phrase}?"
  response = {
    "city_names": city_names,
    "parsed_prompt": parsed_prompt
  }
  return response

# This function returns the AQI scale region color based on AQI value
def get_aqi_scale_color(aqi_value):
  color = None
  if aqi_value >= 0 and aqi_value <= 50:
    color = "green"
  elif aqi_value >= 51 and aqi_value <= 100:
    color = "yellow"
  elif aqi_value >= 101 and aqi_value <= 150:
    color = "orange"
  elif aqi_value >= 151 and aqi_value <= 200:
    color = "red"
  elif aqi_value >= 201 and aqi_value <= 300:
    color = "purple"
  else:
    color = "maroon"
  return color

# This function returns the AQI data from the city data using the WAQI API (website: https://aqicn.org/here/ api doc: https://aqicn.org/json-api/doc/)
def get_aqi_response_from_city_data(city_names):
  waqi_api_url = None
  city_aqi_data = []
  response = None
  result = None
  aqi_values = []
  for city_name in city_names:
    try:
      waqi_api_url = f"https://api.waqi.info/feed/{city_name}/?token={waqi_api_key}"
      response = requests.get(waqi_api_url)
      json_response = json.loads(response)
      aqi_value = json_response.get("data").get("aqi")
      aqi_values.append(str(aqi_value))
      aqi_scale_color = get_aqi_scale_color(aqi_value)
      city_aqi_data.append(
        {
          "id": uuid.uuid4(),
          "city": city_name,
          "aqi": aqi_value,
          "color": aqi_scale_color
        }
      )
    except Exception as e:
      print(e)
      result = {
        "city_aqi_data": [],
        "response": "Sorry, I couldn't find the air quality of the city you asked for."
      }
      return result
    
  city_phrase = parse_list_as_readable_string(city_names)
  aqi_phrase = parse_list_as_readable_string(aqi_values)
  response = f"The air qualities of {city_phrase} are {aqi_phrase} respectively." 

  result = {
    "city_aqi_data": city_aqi_data,
    "response": response,
  }
  return result