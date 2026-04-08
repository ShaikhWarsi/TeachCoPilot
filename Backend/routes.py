"""
Flask Routes - API endpoints for Teacher Copilot (Demo Mode 2.0)
Using mock OCR and LLM for demo purposes
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

# Import mock demo mode instead of real OCR and LLM
from demo_mode import extract_text, evaluate_assignment, AssignmentEvaluator

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
    Evaluate a single assignment file (Demo Mode)
    
    POST /api/evaluate
    Content-Type: multipart/form-data
    
    Form Fields:
        - file: The assignment file (PDF, DOCX, or image)
        - assignment_name: (optional) Name of the assignment
        - subject: (optional) Subject area (defaults to Python)
        - questions_file: (optional) PDF containing questions/answer key
    
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
        
        # Get optional metadata - default subject to Python
        assignment_name = request.form.get('assignment_name', 'Untitled Assignment')
        subject = request.form.get('subject', 'Python')  # Default to Python
        
        # Handle optional questions/answer key file
        questions_text = None
        questions_file = request.files.get('questions_file')
        questions_path = None
        
        if questions_file and questions_file.filename:
            questions_filename = secure_filename(questions_file.filename)
            questions_ext = questions_filename.rsplit('.', 1)[1].lower()
            questions_unique = f"questions_{uuid.uuid4().hex}.{questions_ext}"
            upload_folder = current_app.config['UPLOAD_FOLDER']
            questions_path = os.path.join(upload_folder, questions_unique)
            questions_file.save(questions_path)
            print(f"Questions file saved: {questions_path}")
        
        # Generate unique filename
        original_filename = secure_filename(file.filename)
        file_ext = original_filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
        
        # Use config for upload folder
        upload_folder = current_app.config['UPLOAD_FOLDER']
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)
        
        print(f"File saved: {file_path}")
        print(f"Original name: {original_filename}")
        print(f"Assignment: {assignment_name}, Subject: {subject}")
        
        try:
            # Step 1: Extract questions text if provided
            if questions_path:
                print("Extracting questions from questions file...")
                questions_text = extract_text(questions_path)
                print(f"Questions extracted (length: {len(questions_text)})")
            
            # Step 2: Extract text using mock OCR
            print("Starting text extraction (Demo Mode)...")
            extracted_text = extract_text(file_path)
            
            if not extracted_text or not extracted_text.strip():
                return jsonify({
                    'success': False,
                    'error': 'Empty text extracted',
                    'message': 'Could not extract text from the file. Please ensure the file is not empty or corrupted.'
                }), 422
            
            print(f"Text extracted successfully (length: {len(extracted_text)})")
            
            # Step 3: Evaluate with mock LLM
            print("Starting LLM evaluation (Demo Mode)...")
            context = f"Assignment: {assignment_name}, Subject: {subject}"
            evaluation = evaluate_assignment(extracted_text, context, questions_text)
            
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
                    'extracted_text_length': len(extracted_text),
                    'questions_provided': questions_text is not None,
                    'questions_text_length': len(questions_text) if questions_text else 0,
                    'demo_mode': True
                },
                'message': 'Evaluation completed successfully (Demo Mode)'
            })
            
        finally:
            # Clean up uploaded files
            from demo_mode import MockOCRExtractor
            MockOCRExtractor.cleanup_file(file_path)
            if questions_path:
                MockOCRExtractor.cleanup_file(questions_path)
            
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
    Evaluate multiple assignment files (Demo Mode)
    
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
        
        # Use config for upload folder
        file_paths = []
        upload_folder = current_app.config['UPLOAD_FOLDER']
        
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
                
                # Extract text using mock OCR
                text = extract_text(file_path)
                if text and text.strip():
                    extracted_texts.append(text)
            
            if not extracted_texts:
                return jsonify({
                    'success': False,
                    'error': 'No text extracted',
                    'message': 'Could not extract text from any of the uploaded files'
                }), 422
            
            # Batch evaluate using mock LLM
            evaluator = AssignmentEvaluator()
            batch_result = evaluator.batch_evaluate(extracted_texts)
            
            return jsonify({
                'success': True,
                'data': {
                    'average_score': batch_result['average_score'],
                    'total_evaluated': batch_result['total_evaluated'],
                    'common_mistakes': batch_result['common_mistakes'],
                    'summary': batch_result['summary'],
                    'assignment_name': assignment_name,
                    'demo_mode': True
                },
                'message': f'Successfully evaluated {batch_result["total_evaluated"]} assignments (Demo Mode)'
            })
            
        finally:
            # Clean up all files
            from demo_mode import MockOCRExtractor
            for file_path in file_paths:
                MockOCRExtractor.cleanup_file(file_path)
                
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
        'service': 'Teacher Copilot API (Demo Mode 2.0)',
        'version': '2.0.0',
        'features': ['mock_ocr', 'mock_llm', 'csv_reporting', 'demo_mode']
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
