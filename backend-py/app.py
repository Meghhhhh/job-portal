# # flask --app app.py run --debug

import os
import logging
import json
import re
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from pypdf import PdfReader
from resumeparser import resume_extractor
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()  ## load all our environment variables

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Configure application
UPLOAD_PATH = Path("__DATA__")
UPLOAD_PATH.mkdir(exist_ok=True)

app = Flask(__name__)
CORS(app)

def get_gemini_response(input_text):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(input_text)
    return response.text

def input_pdf_text(filepath):
    reader = PdfReader(filepath)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

# Prompt Template
input_prompt = """
Hey Act Like a skilled or very experience ATS(Application Tracking System)
with a deep understanding of tech field,software engineering,data science ,data analyst
and big data engineer. Your task is to evaluate the resume based on the given job description.
You must consider the job market is very competitive and you should provide 
best assistance for improving the resumes. Assign the percentage Matching based 
on Jd and
the missing keywords with high accuracy
resume:{text}
description:{jd}

I want the response in one single string having the structure
{{"JD Match":"%","MissingKeywords":[],"Profile Summary":""}}
"""

# @app.route('/')
# def index():
#     return render_template('index.html')

@app.route('/')
def index():
    return "Hello, World!"

@app.route("/process", methods=["POST"])
def process_resume():
    try:
        logger.debug("Starting resume processing")
        
        if 'pdf_doc' not in request.files:
            logger.error("No file in request")
            return render_template('index.html', error="No file uploaded")
        
        file = request.files['pdf_doc']
        if file.filename == '':
            logger.error("No filename")
            return render_template('index.html', error="No file selected")
            
        if not file.filename.lower().endswith('.pdf'):
            logger.error("Invalid file type")
            return render_template('index.html', error="Only PDF files are allowed")
        
        # Save file
        filepath = UPLOAD_PATH / "file.pdf"
        logger.debug(f"Saving file to {filepath}")
        file.save(filepath)
        
        try:
            # Read PDF
            logger.debug("Reading PDF content")
            reader = PdfReader(filepath)
            content = ""
            for page in reader.pages:
                content += page.extract_text()
            
            logger.debug("Extracted PDF content length: %d", len(content))
            if not content.strip():
                raise ValueError("PDF appears to be empty or unreadable")
            
            # Process with Resume
            logger.debug("Calling Resume extractor")
            result = resume_extractor(content)
            logger.debug("Resume extraction complete")
            
            # Clean up file
            filepath.unlink()
            
            return render_template('index.html', data=result)
            
        except Exception as e:
            logger.exception("Error processing resume")
            return render_template('index.html', error=f"Error processing resume: {str(e)}")
        finally:
            # Ensure file is cleaned up
            if filepath.exists():
                filepath.unlink()
                
    except Exception as e:
        logger.exception("Unexpected error")
        return render_template('index.html', error=f"An unexpected error occurred: {str(e)}")

@app.route("/ats", methods=["POST"])
def ats_extraction():
    try:
        logger.debug("Starting ATS extraction")
        
        if 'pdf_doc' not in request.files:
            logger.error("No file in request")
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['pdf_doc']
        if file.filename == '':
            logger.error("No filename")
            return jsonify({"error": "No file selected"}), 400
            
        if not file.filename.lower().endswith('.pdf'):
            logger.error("Invalid file type")
            return jsonify({"error": "Only PDF files are allowed"}), 400
        
        jd = request.form.get('job_description')
        if not jd:
            logger.error("No job description provided")
            return jsonify({"error": "Job description is required"}), 400
        
        # Save file
        filepath = UPLOAD_PATH / "ats_file.pdf"
        logger.debug(f"Saving file to {filepath}")
        file.save(filepath)
        
        try:
            # Read PDF
            logger.debug("Reading PDF content")
            text = input_pdf_text(filepath)
            
            logger.debug("Extracted PDF content length: %d", len(text))
            if not text.strip():
                raise ValueError("PDF appears to be empty or unreadable")
            
            # Prepare prompt
            prompt = input_prompt.format(text=text, jd=jd)
            
            # Get Gemini response
            logger.debug("Calling Gemini API")
            raw_response = get_gemini_response(prompt)
            logger.debug("Gemini response received")
            cleaned_response = re.sub(r"```json(.*?)```", r"\1", raw_response, flags=re.DOTALL).strip()
            print(raw_response)
            # Convert raw response to JSON
            parsed_data = json.loads(cleaned_response)
            logger.debug("Successfully parsed JSON response")
            
            # Clean up file
            filepath.unlink()
            
            return jsonify(parsed_data)
            
        except Exception as e:
            logger.exception("Error processing ATS extraction")
            return jsonify({"error": f"Error processing ATS extraction: {str(e)}"}), 500
        finally:
            # Ensure file is cleaned up
            if filepath.exists():
                filepath.unlink()
                
    except Exception as e:
        logger.exception("Unexpected error")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)