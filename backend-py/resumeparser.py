import requests
import json
import logging
from typing import Dict
import re
from dotenv import load_dotenv
import os

load_dotenv() ## load all our environment variables

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def resume_extractor(resume_data: str) -> Dict:
    """Extract structured information from resume text"""
    try:
        logger.debug("Starting Resume extraction")

        # Load API key
        api_key = os.getenv("OPENROUTER_API_KEY")
        logger.debug("Config loaded successfully")

        # OpenRouter API URL
        url = "https://openrouter.ai/api/v1/chat/completions"

        # Define the prompt
        prompt = '''
        Parse the following resume and return ONLY a JSON object. 
        Do NOT include markdown code blocks, explanations, or extra text.
        Ensure the response starts with `{` and ends with `}`.

        {
            "full_name": "string",
            "email": "string",
            "github": "string",
            "linkedin": "string",
            "employment": [{"company": "string", "position": "string", "duration": "string"}],
            "technical_skills": ["string"],
            "soft_skills": ["string"]
        }
        '''
        # API request payload
        payload = {
            "model": "deepseek/deepseek-r1:free",
            "messages": [
                {"role": "system", "content": prompt},
                {"role": "user", "content": resume_data}
            ],
            "temperature": 0.0,
            "max_tokens": 1500
        }

        # API request headers (Removed HTTP-Referer and X-Title)
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        # Make the request
        logger.debug("Calling OpenAI API")
        response = requests.post(url, headers=headers, json=payload)

        # Check if response is OK
        if response.status_code != 200:
            logger.error(f"API request failed: {response.status_code}, {response.text}")
            raise ValueError(f"API request failed: {response.status_code}")

        # Parse JSON response
        result = response.json()
        logger.debug(f"Received response: {result}")

        # Extract text response correctly
        raw_response = result.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
        
        if not raw_response:
            logger.error("Empty response from OpenRouter")
            raise ValueError("Received empty response from OpenRouter")

        logger.debug(f"Raw response: {raw_response}")

        # Remove Markdown blocks if present
        cleaned_response = re.sub(r"```json(.*?)```", r"\1", raw_response, flags=re.DOTALL).strip()

        # Convert raw response to JSON
        parsed_data = json.loads(cleaned_response)
        logger.debug("Successfully parsed JSON response")

        return parsed_data

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {str(e)}")
        raise ValueError("Failed to parse AI response as JSON")

    except Exception as e:
        logger.exception("Error in Resume extraction")
        raise