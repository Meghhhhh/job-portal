import google.generativeai as genai
import os
import re
import json
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def get_gemini_response(input_text):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(input_text)
    cleaned_response = re.sub(r"```json(.*?)```", r"\1", response.text, flags=re.DOTALL).strip()

    parsed_data = json.loads(cleaned_response)
    return parsed_data