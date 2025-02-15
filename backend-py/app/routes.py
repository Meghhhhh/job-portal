from flask import Blueprint, request, jsonify, render_template
from app.services.pdf_service import input_pdf_text
from app.services.gemini_service import get_gemini_response
from app.services.openrouter_service import resume_extractor
import logging
import os
from pathlib import Path

UPLOAD_PATH = Path("__DATA__")
UPLOAD_PATH.mkdir(exist_ok=True)

resume_bp = Blueprint("resume", __name__)

@resume_bp.route("/")
def index():
    return "Hello, World!"

# @resume_bp.route("/process", methods=["POST"])
# def process_resume():
#     try:
#         if 'pdf_doc' not in request.files:
#             return jsonify({"error": "No file uploaded"}), 400

#         file = request.files['pdf_doc']
#         if file.filename == '':
#             return jsonify({"error": "No file selected"}), 400

#         if not file.filename.lower().endswith('.pdf'):
#             return jsonify({"error": "Only PDF files are allowed"}), 400

#         filepath = UPLOAD_PATH / "file.pdf"
#         file.save(filepath)

#         # Read PDF
#         text = input_pdf_text(filepath)
#         if not text.strip():
#             raise ValueError("PDF appears to be empty or unreadable")

#         # Extract resume data
#         result = resume_extractor(text)

#         # Clean up file
#         filepath.unlink()

#         return result

#     except Exception as e:
#         logging.exception("Error processing resume")
#         return jsonify({"error": str(e)}), 500

@resume_bp.route("/process", methods=["POST"])
def process_resume():
    try:
        if 'pdf_doc' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['pdf_doc']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Only PDF files are allowed"}), 400

        filepath = UPLOAD_PATH / "file.pdf"
        file.save(filepath)

        # Read PDF
        text = input_pdf_text(filepath)
        if not text.strip():
            raise ValueError("PDF appears to be empty or unreadable")
        print(text)
        prompt = f"""
        You are an advanced resume parser. Extract structured information from the following resume text and return ONLY a well-formatted JSON object. Ensure accurate data extraction, following the exact structure below. 

        Resume: {text}

        Output JSON structure:
        {{
            "name": "",  # Full name of the candidate
            "email": "",  # Email address
            "mobile": "",  # Contact number
            "schoolAddress": "",  # Current address or university address
            "permanentAddress": "",  # Permanent home address
            "summary": "",  # Professional summary or objective statement

            "education": [
                {{
                    "institution": "",  # Name of university or school
                    "location": "",  # Location of the institution
                    "degree": "",  # Degree earned (e.g., BSc in Computer Science)
                    "major": "",  # Major subject (if applicable)
                    "gpa": "",  # GPA or percentage (if mentioned)
                    "honors": "",  # Any honors or distinctions received
                    "graduationYear": ""  # Year of graduation
                }}
            ],

            "experience": [
                {{
                    "role": "",  # Job title
                    "company": "",  # Company or organization name
                    "location": "",  # Work location
                    "duration": "",  # Employment period (e.g., Jan 2020 - Dec 2022)
                    "details": ""  # Key responsibilities and achievements
                }}
            ],

            "projects": [
                {{
                    "name": "",  # Project title
                    "description": "",  # Brief description of the project
                    "technologies": []  # List of technologies used
                }}
            ],

            "achievements": [
                {{
                    "title": "",  # Name of the achievement or award
                    "description": ""  # Additional details about the achievement
                }}
            ],

            "certifications": [
                {{
                    "title": "",  # Certification name
                    "issuer": "",  # Issuing organization
                    "year": ""  # Year of certification
                }}
            ],

            "skills": [],  # List of skills or technologies
            "languages": [],  # List of languages known
            "linkedin": "",  # LinkedIn profile link (if available)
            "github": "",  # GitHub profile link (if available)
            "portfolio": ""  # Personal website or portfolio link (if available)
        }}
        """
        response = get_gemini_response(prompt)
        return jsonify(response)

    except Exception as e:
        logging.exception("Error processing resume")
        return jsonify({"error": str(e)}), 500


@resume_bp.route("/ats", methods=["POST"])
def ats_extraction():
    try:
        if 'pdf_doc' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['pdf_doc']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Only PDF files are allowed"}), 400

        jd = request.form.get('job_description')
        if not jd:
            return jsonify({"error": "Job description is required"}), 400

        filepath = UPLOAD_PATH / "ats_file.pdf"
        file.save(filepath)

        text = input_pdf_text(filepath)
        if not text.strip():
            raise ValueError("PDF appears to be empty or unreadable")

        prompt = f"""
        Hey, Act Like an ATS (Applicant Tracking System).
        Evaluate the resume based on the given job description.
        Assign a match percentage and list missing keywords.

        Resume: {text}
        Job Description: {jd}

        Output JSON structure:
        {{"JD Match":"%","MissingKeywords":[],"Profile Summary":""}}
        """

        response = get_gemini_response(prompt)

        return jsonify(response)

    except Exception as e:
        logging.exception("Error processing ATS extraction")
        return jsonify({"error": str(e)}), 500