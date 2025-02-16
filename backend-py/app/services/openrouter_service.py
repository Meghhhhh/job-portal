import requests
import json
import logging
import os
import re

def resume_extractor(resume_data):
    try:
        api_key = os.getenv("OPENROUTER_API_KEY")
        url = "https://openrouter.ai/api/v1/chat/completions"

        prompt = '''
        Parse the following resume and return ONLY a JSON object. 
        Ensure the response starts with `{` and ends with `}`.
        {
            name: 'string',
            email: 'string',
            mobile: 'string',
            schoolAddress: ''string,
            permanentAddress: 'string',
            summary: 'string',
            education: [
            {
                institution: 'string',
                location: 'string',
                degree: 'string',
                extra: 'string',
                gpa: 'string',
                honors: 'string',
            },
            ],
            experience: [
            { role: 'string', company: 'string', location: 'string', duration: 'string', details: 'string' },
            ],
            projects: [{ name: 'string', description: 'string' }],
            achievements: [{ title: 'string', description: 'string' }],
            skills: ["string"],
        }
        '''

        payload = {
            "model": "deepseek/deepseek-r1:free",
            "messages": [
                {"role": "system", "content": prompt},
                {"role": "user", "content": resume_data}
            ],
            "temperature": 0.0,
            "max_tokens": 1500
        }

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        response = requests.post(url, headers=headers, json=payload)

        if response.status_code != 200:
            raise ValueError(f"API request failed: {response.status_code}")

        # Parse JSON response
        result = response.json()

        # Extract text response correctly
        raw_response = result.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
        
        if not raw_response:
            raise ValueError("Received empty response from OpenRouter")

        # Remove Markdown blocks if present
        cleaned_response = re.sub(r"```json(.*?)```", r"\1", raw_response, flags=re.DOTALL).strip()

        # Convert raw response to JSON
        parsed_data = json.loads(cleaned_response)
        print(parsed_data)
        return parsed_data


    except json.JSONDecodeError:
        raise ValueError("Failed to parse AI response as JSON")