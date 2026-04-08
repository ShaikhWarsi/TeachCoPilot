"""
Flask Routes - API endpoints for Teacher Copilot
Merged with features from existing Edu-Evaluator backend
"""

import os
import io
import uuid
import pandas as pd
from hashlib import md5
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app, send_file
from flask_bcrypt import Bcrypt
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename

from ocr import extract_text, OCRExtractor
from llm import evaluate_assignment, AssignmentEvaluator

# Blueprint definition
api_bp = Blueprint('api', __name__)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'png', 'jpg', 'jpeg'}


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_evaluation_to_csv(assignment_name, subject, score, filename):
    """Save evaluation result to CSV file for reporting"""
    try:
        report_file = current_app.config['REPORT_FILE']
        df = pd.read_csv(report_file)
        
        new_entry = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "assignment_name": assignment_name,
            "subject": subject,
            "score": score,
            "filename": filename
        }
        
        df = pd.concat([df, pd.DataFrame([new_entry])], ignore_index=True)
        df.to_csv(report_file, index=False)
        print(f"Saved to CSV: {new_entry}")
    except Exception as e:
        print(f"CSV save error: {e}")


def generate_file_hash(file_content):
    """Generate MD5 hash of file content for deduplication"""
    return md5(file_content).hexdigest()


@api_bp.route('/evaluate', methods=['POST'])
def evaluate():
    """
    Evaluate a single assignment file
    
    POST /api/evaluate
    Content-Type: multipart/form-data
    
    Form Fields:
        - file: The assignment file (PDF, DOCX, or image)
        - assignment_name: (optional) Name of the assignment
        - subject: (optional) Subject area
    
    Returns:
        JSON with score, feedback, mistakes, suggestions
    """
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided',
                'message': 'Please upload a file (PDF, DOCX, or image)'
            }), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected',
                'message': 'Please select a file to upload'
            }), 400
        
        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'Invalid file type',
                'message': f'Allowed formats: {", ".join(ALLOWED_EXTENSIONS)}'
            }), 400
        
        # Get optional metadata
        assignment_name = request.form.get('assignment_name', 'Untitled Assignment')
        subject = request.form.get('subject', 'General')
        
        # Generate unique filename
        original_filename = secure_filename(file.filename)
        file_ext = original_filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
        
        # Save file temporarily
        upload_folder = os.path.join(os.path.dirname(__file__), 'uploads')
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)
        
        print(f"File saved: {file_path}")
        print(f"Original name: {original_filename}")
        print(f"Assignment: {assignment_name}, Subject: {subject}")
        
        try:
            # Step 1: Extract text using OCR
            print("Starting text extraction...")
            extracted_text = extract_text(file_path)
            
            if not extracted_text or not extracted_text.strip():
                return jsonify({
                    'success': False,
                    'error': 'Empty text extracted',
                    'message': 'Could not extract text from the file. Please ensure the file is not empty or corrupted.'
                }), 422
            
            print(f"Text extracted successfully (length: {len(extracted_text)})")
            
            # Step 2: Evaluate with LLM
            print("Starting LLM evaluation...")
            context = f"Assignment: {assignment_name}, Subject: {subject}"
            evaluation = evaluate_assignment(extracted_text, context)
            
            print("Evaluation completed successfully")
            
            # Save to CSV for reporting
            save_evaluation_to_csv(assignment_name, subject, evaluation['score'], original_filename)
            
            # Return successful response
            return jsonify({
                'success': True,
                'data': {
                    'score': evaluation['score'],
                    'feedback': evaluation['feedback'],
                    'mistakes': evaluation['mistakes'],
                    'suggestions': evaluation['suggestions'],
                    'assignment_name': assignment_name,
                    'subject': subject,
                    'extracted_text_length': len(extracted_text)
                },
                'message': 'Evaluation completed successfully'
            })
            
        finally:
            # Clean up uploaded file
            OCRExtractor.cleanup_file(file_path)
            
    except ValueError as e:
        print(f"Validation error: {e}")
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'message': str(e)
        }), 400
        
    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': f'An error occurred during evaluation: {str(e)}'
        }), 500


@api_bp.route('/batch-evaluate', methods=['POST'])
def batch_evaluate():
    """
    Evaluate multiple assignment files
    
    POST /api/batch-evaluate
    Content-Type: multipart/form-data
    
    Form Fields:
        - files[]: Multiple assignment files
        - assignment_name: (optional) Name of the assignment batch
    
    Returns:
        JSON with average score, common mistakes, summary
    """
    try:
        # Check if files are present
        if 'files' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No files provided',
                'message': 'Please upload at least one file'
            }), 400
        
        files = request.files.getlist('files')
        
        # Filter empty files
        files = [f for f in files if f and f.filename != '']
        
        if not files:
            return jsonify({
                'success': False,
                'error': 'No valid files',
                'message': 'No valid files were uploaded'
            }), 400
        
        # Validate file types
        invalid_files = [f.filename for f in files if not allowed_file(f.filename)]
        if invalid_files:
            return jsonify({
                'success': False,
                'error': 'Invalid file types',
                'message': f'Some files have unsupported formats: {", ".join(invalid_files[:3])}'
            }), 400
        
        assignment_name = request.form.get('assignment_name', 'Batch Evaluation')
        
        # Save files and extract text
        file_paths = []
        upload_folder = os.path.join(os.path.dirname(__file__), 'uploads')
        
        try:
            extracted_texts = []
            
            for file in files:
                # Save file
                original_filename = secure_filename(file.filename)
                file_ext = original_filename.rsplit('.', 1)[1].lower()
                unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
                file_path = os.path.join(upload_folder, unique_filename)
                file.save(file_path)
                file_paths.append(file_path)
                
                # Extract text
                text = extract_text(file_path)
                if text and text.strip():
                    extracted_texts.append(text)
            
            if not extracted_texts:
                return jsonify({
                    'success': False,
                    'error': 'No text extracted',
                    'message': 'Could not extract text from any of the uploaded files'
                }), 422
            
            # Batch evaluate
            evaluator = AssignmentEvaluator()
            batch_result = evaluator.batch_evaluate(extracted_texts)
            
            return jsonify({
                'success': True,
                'data': {
                    'average_score': batch_result['average_score'],
                    'total_evaluated': batch_result['total_evaluated'],
                    'common_mistakes': batch_result['common_mistakes'],
                    'summary': batch_result['summary'],
                    'assignment_name': assignment_name
                },
                'message': f'Successfully evaluated {batch_result["total_evaluated"]} assignments'
            })
            
        finally:
            # Clean up all files
            for file_path in file_paths:
                OCRExtractor.cleanup_file(file_path)
                
    except Exception as e:
        print(f"Batch evaluation error: {e}")
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': f'An error occurred during batch evaluation: {str(e)}'
        }), 500


@api_bp.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Teacher Copilot API',
        'version': '1.1.0',
        'features': ['local_ocr', 'groq_llm', 'csv_reporting']
    })


@api_bp.route('/report', methods=['GET'])
def download_report():
    """Download CSV report of all evaluations"""
    try:
        report_file = current_app.config['REPORT_FILE']
        if os.path.exists(report_file):
            return send_file(
                report_file,
                mimetype='text/csv',
                as_attachment=True,
                download_name=f'evaluation_report_{datetime.now().strftime("%Y%m%d")}.csv'
            )
        else:
            return jsonify({
                'success': False,
                'error': 'Report not found',
                'message': 'No evaluations have been recorded yet'
            }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': str(e)
        }), 500


@api_bp.route('/report/data', methods=['GET'])
def get_report_data():
    """Get evaluation report data as JSON"""
    try:
        report_file = current_app.config['REPORT_FILE']
        if os.path.exists(report_file):
            df = pd.read_csv(report_file)
            # Convert to dict and handle NaN values
            data = df.fillna('').to_dict('records')
            return jsonify({
                'success': True,
                'data': data,
                'total_records': len(data)
            })
        else:
            return jsonify({
                'success': True,
                'data': [],
                'total_records': 0
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': str(e)
        }), 500


@api_bp.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return jsonify({
        'success': False,
        'error': 'File too large',
        'message': 'Maximum file size is 16MB'
    }), 413
