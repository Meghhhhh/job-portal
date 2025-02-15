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

        # Extract resume data
        result = resume_extractor(text)

        # Clean up file
        filepath.unlink()

        return result

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