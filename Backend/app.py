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
    
    # Configuration - Use temp directory appropriate for the OS
    import tempfile
    base_tmp = os.path.join(tempfile.gettempdir(), 'teco')
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
    app.config['UPLOAD_FOLDER'] = os.path.join(base_tmp, 'uploads')
    app.config['REPORT_FILE'] = os.path.join(base_tmp, 'student_scores.csv')
    
    # SECRET_KEY must be set via environment variable in production
    secret_key = os.getenv('SECRET_KEY')
    if not secret_key:
        import secrets
        secret_key = secrets.token_hex(32)
        print("⚠️  WARNING: Using auto-generated SECRET_KEY. Set SECRET_KEY env var in production!")
    app.config['SECRET_KEY'] = secret_key
    
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_FILE_DIR'] = os.path.join(base_tmp, 'flask_sessions')
    
    # Ensure directories exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['SESSION_FILE_DIR'], exist_ok=True)
    
    # Initialize CSV if not exists in /tmp
    if not os.path.exists(app.config['REPORT_FILE']):
        df = pd.DataFrame(columns=["timestamp", "assignment_name", "subject", "score", "filename"])
        df.to_csv(app.config['REPORT_FILE'], index=False)
    
    # Initialize extensions
    bcrypt = Bcrypt(app)
    login_manager = LoginManager(app)
    login_manager.login_view = "api.login"
    Session(app)
    
    # Enable CORS for frontend - restrict to specific origins in production
    allowed_origins = os.getenv('ALLOWED_ORIGINS', 'https://rachit-tw-teco.hf.space,http://localhost:5173,http://localhost:3000').split(',')
    CORS(app, resources={
        r"/api/*": {
            "origins": allowed_origins,
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
    
    @app.route('/')
    def index():
        """Root endpoint"""
        return {
            'message': 'Welcome to Teacher Copilot API',
            'status': 'active',
            'endpoints': ['/api', '/health']
        }

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

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 7860))
    # Debug mode disabled by default for production safety
    debug_mode = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
