from flask import Flask
from flask_cors import CORS
from config.settings import Config
import logging
import os

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Load config
    app.config.from_object(Config)

    # Configure logging
    logging.basicConfig(level=logging.DEBUG)

    # Register routes
    from app.routes import resume_bp
    app.register_blueprint(resume_bp)

    return app