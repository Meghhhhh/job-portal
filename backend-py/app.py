import os
import sys
import logging
from flask import Flask, request, render_template, jsonify
from pypdf import PdfReader
import json
from pathlib import Path
from werkzeug.utils import secure_filename
from resumeparser import ats_extractor

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Configure application
UPLOAD_PATH = Path("__DATA__")
UPLOAD_PATH.mkdir(exist_ok=True)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

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
            
            # Process with ATS
            logger.debug("Calling ATS extractor")
            result = ats_extractor(content)
            logger.debug("ATS extraction complete")
            
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

if __name__ == "__main__":
    app.run(port=8000, debug=True)

# flask --app app.py run --debug