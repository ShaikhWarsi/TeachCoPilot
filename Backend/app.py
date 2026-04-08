"""
Teacher Copilot - Flask Backend
AI-powered assignment evaluation with local OCR and Groq LLM
Merged with features from existing Edu-Evaluator backend
"""

import os
import io
import uuid
import pandas as pd
from hashlib import md5
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_session import Session
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configuration
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
    app.config['REPORT_FILE'] = os.path.join(os.path.dirname(__file__), 'student_scores.csv')
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_FILE_DIR'] = os.path.join(os.path.dirname(__file__), 'flask_sessions')
    
    # Ensure directories exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['SESSION_FILE_DIR'], exist_ok=True)
    
    # Initialize CSV if not exists
    if not os.path.exists(app.config['REPORT_FILE']):
        df = pd.DataFrame(columns=["timestamp", "assignment_name", "subject", "score", "filename"])
        df.to_csv(app.config['REPORT_FILE'], index=False)
    
    # Initialize extensions
    bcrypt = Bcrypt(app)
    login_manager = LoginManager(app)
    login_manager.login_view = "api.login"
    Session(app)
    
    # Enable CORS for frontend
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Import and register blueprints
    from routes import api_bp
    from classroom_routes import classroom_bp
    from auth_routes import auth_bp
    
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(classroom_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    
    @app.route('/health')
    def health_check():
        """Health check endpoint"""
        return {
            'status': 'healthy', 
            'service': 'Teacher Copilot API',
            'version': '1.1.0',
            'features': ['local_ocr', 'groq_llm', 'csv_reporting']
        }
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
