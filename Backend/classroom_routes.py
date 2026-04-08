"""
Classroom Routes - API endpoints for classroom workflow (Demo Mode 2.0)
Using mock OCR and LLM for demo purposes
"""

import os
import uuid
import pandas as pd
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

from classroom_models import Classroom, Submission, store
# Import mock demo mode instead of real OCR and LLM
from demo_mode import extract_text, evaluate_assignment, AssignmentEvaluator, MockOCRExtractor
from analytics_engine import generate_classroom_analytics
from auth import auth_store, login_required, get_current_user

# Blueprint definition
classroom_bp = Blueprint('classroom', __name)

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'png', 'jpg', 'jpeg'}


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ==================== CLASSROOM MANAGEMENT ====================

@classroom_bp.route('/classrooms', methods=['GET'])
@login_required
def list_classrooms():
    """Get all classrooms for current user"""
    user = get_current_user()
    classrooms = store.get_all_classrooms(user_id=user['id'])
    return jsonify({
        'success': True,
        'data': [
            {
                'id': c.id,
                'name': c.name,
                'subject': c.subject,
                'assignment_title': c.assignment_title,
                'date_created': c.date_created,
                'stats': c.get_stats(store)
            }
            for c in classrooms
        ]
    })


@classroom_bp.route('/classrooms', methods=['POST'])
@login_required
def create_classroom():
    """Create a new classroom"""
    try:
        data = request.get_json()
        user = get_current_user()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        name = data.get('name', '').strip()
        subject = data.get('subject', 'Python').strip()  # Default to Python
        assignment_title = data.get('assignment_title', '').strip()
        
        if not name or not subject or not assignment_title:
            return jsonify({
                'success': False,
                'error': 'Missing required fields',
                'message': 'Please provide name, subject, and assignment_title'
            }), 400
        
        classroom = store.create_classroom(user['id'], name, subject, assignment_title)
        
        return jsonify({
            'success': True,
            'data': {
                'id': classroom.id,
                'name': classroom.name,
                'subject': classroom.subject,
                'assignment_title': classroom.assignment_title,
                'date_created': classroom.date_created
            },
            'message': 'Classroom created successfully'
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': str(e)
        }), 500


@classroom_bp.route('/classrooms/<classroom_id>', methods=['GET'])
@login_required
def get_classroom(classroom_id):
    """Get a specific classroom with its stats"""
    user = get_current_user()
    classroom = store.get_classroom(classroom_id, user_id=user['id'])
    
    if not classroom:
        return jsonify({
            'success': False,
            'error': 'Classroom not found'
        }), 404
    
    submissions = store.get_submissions(classroom_id)
    
    return jsonify({
        'success': True,
        'data': {
            'id': classroom.id,
            'name': classroom.name,
            'subject': classroom.subject,
            'assignment_title': classroom.assignment_title,
            'date_created': classroom.date_created,
            'stats': classroom.get_stats(store),
            'submission_count': len(submissions)
        }
    })


@classroom_bp.route('/classrooms/<classroom_id>', methods=['DELETE'])
@login_required
def delete_classroom(classroom_id):
    """Delete a classroom"""
    user = get_current_user()
    classroom = store.get_classroom(classroom_id, user_id=user['id'])
    
    if not classroom:
        return jsonify({
            'success': False,
            'error': 'Classroom not found'
        }), 404
    
    if store.delete_classroom(classroom_id):
        return jsonify({
            'success': True,
            'message': 'Classroom deleted successfully'
        })
    
    return jsonify({
        'success': False,
        'error': 'Failed to delete classroom'
    }), 500


# ==================== BATCH UPLOAD & EVALUATION ====================

@classroom_bp.route('/classrooms/<classroom_id>/upload', methods=['POST'])
@login_required
def batch_upload(classroom_id):
    """
    Batch upload and evaluate multiple student assignments (Demo Mode)
    Optimized for 4 PDFs
    
    POST /classrooms/{id}/upload
    Content-Type: multipart/form-data
    
    Form Fields:
        - files[]: Multiple files (required)
        - naming_pattern: (optional) How to extract student names from filenames
        - questions_file: (optional) PDF containing questions/answer key for evaluation reference
    """
    import time
    start_time = time.time()
    
    try:
        user = get_current_user()
        classroom = store.get_classroom(classroom_id, user_id=user['id'])
        if not classroom:
            return jsonify({
                'success': False,
                'error': 'Classroom not found'
            }), 404
        
        # Check if files are present
        if 'files' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No files provided',
                'message': 'Please upload at least one file'
            }), 400
        
        files = request.files.getlist('files')
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
            
            # Extract questions text for use in all evaluations
            try:
                print("Extracting questions text (Demo Mode)...")
                questions_text = extract_text(questions_path)
                print(f"Questions extracted (length: {len(questions_text)})")
            except Exception as e:
                print(f"Failed to extract questions: {e}")
        
        # Process each file with progress tracking
        results = []
        failed_files = []
        progress_updates = []
        
        for idx, file in enumerate(files):
            file_start_time = time.time()
            try:
                # Log progress
                progress_msg = f"Processing file {idx + 1}/{len(files)}: {file.filename}"
                print(progress_msg)
                progress_updates.append({
                    'file': file.filename,
                    'status': 'processing',
                    'index': idx + 1,
                    'total': len(files)
                })
                
                # Generate unique filename
                original_filename = secure_filename(file.filename)
                file_ext = original_filename.rsplit('.', 1)[1].lower()
                unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
                
                # Save file temporarily
                upload_folder = current_app.config['UPLOAD_FOLDER']
                file_path = os.path.join(upload_folder, unique_filename)
                file.save(file_path)
                
                try:
                    # Extract student name from filename (before extension)
                    student_name = original_filename.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title()
                    
                    # Step 1: Extract text with mock OCR
                    extracted_text = extract_text(file_path)
                    
                    if not extracted_text or not extracted_text.strip():
                        failed_files.append({
                            'filename': original_filename,
                            'error': 'Could not extract text from file'
                        })
                        continue
                    
                    # Step 2: Evaluate with mock LLM (using questions text if provided)
                    context = f"Classroom: {classroom.name}, Subject: {classroom.subject}, Assignment: {classroom.assignment_title}"
                    evaluation = evaluate_assignment(extracted_text, context, questions_text)
                    
                    # Create submission record (no extracted_text to save storage)
                    submission = Submission(
                        id=str(uuid.uuid4()),
                        student_name=student_name,
                        file_name=original_filename,
                        score=evaluation['score'],
                        feedback=evaluation['feedback'],
                        mistakes=evaluation['mistakes'],
                        suggestions=evaluation['suggestions'],
                        date_submitted=datetime.now().isoformat()
                    )
                    
                    # Save to store
                    store.add_submission(classroom_id, submission)
                    
                    file_duration = round(time.time() - file_start_time, 2)
                    
                    results.append({
                        'submission_id': submission.id,
                        'student_name': student_name,
                        'file_name': original_filename,
                        'score': evaluation['score'],
                        'feedback': evaluation['feedback'],
                        'mistakes': evaluation['mistakes'],
                        'suggestions': evaluation['suggestions'],
                        'status': 'success',
                        'processing_time': file_duration
                    })
                    
                finally:
                    # Clean up file using mock cleanup
                    MockOCRExtractor.cleanup_file(file_path)
                    
            except Exception as e:
                print(f"Error processing file {file.filename}: {e}")
                failed_files.append({
                    'filename': file.filename,
                    'error': str(e),
                    'index': idx + 1
                })
        
        # Generate analytics after all submissions
        analytics = generate_classroom_analytics(classroom_id)
        
        total_duration = round(time.time() - start_time, 2)
        
        # Clean up questions file if it was uploaded
        if questions_path:
            MockOCRExtractor.cleanup_file(questions_path)
        
        return jsonify({
            'success': True,
            'data': {
                'processed': len(results),
                'failed': len(failed_files),
                'total': len(files),
                'processing_time': total_duration,
                'avg_time_per_file': round(total_duration / len(files), 2) if files else 0,
                'questions_provided': questions_text is not None,
                'questions_text_length': len(questions_text) if questions_text else 0,
                'results': results,
                'failed_files': failed_files,
                'progress': progress_updates,
                'analytics': {
                    'overview': analytics['overview'],
                    'score_distribution': analytics['score_distribution'],
                    'pass_fail_ratio': analytics['pass_fail_ratio'],
                    'common_mistakes': analytics['common_mistakes'][:5]  # Top 5 only
                },
                'demo_mode': True
            },
            'message': f'Successfully processed {len(results)} of {len(files)} files in {total_duration}s (Demo Mode - Optimized for 4 PDFs)'
        })
        
    except Exception as e:
        print(f"Batch upload error: {e}")
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': f'An error occurred during batch upload: {str(e)}'
        }), 500


# ==================== ANALYTICS & INSIGHTS ====================

@classroom_bp.route('/classrooms/<classroom_id>/analytics', methods=['GET'])
@login_required
def get_analytics(classroom_id):
    """Get full analytics for a classroom"""
    user = get_current_user()
    classroom = store.get_classroom(classroom_id, user_id=user['id'])
    
    if not classroom:
        return jsonify({
            'success': False,
            'error': 'Classroom not found'
        }), 404
    
    # Generate fresh analytics
    analytics = generate_classroom_analytics(classroom_id)
    
    return jsonify({
        'success': True,
        'data': analytics
    })


@classroom_bp.route('/classrooms/<classroom_id>/submissions', methods=['GET'])
@login_required
def list_submissions(classroom_id):
    """Get all submissions for a classroom"""
    user = get_current_user()
    classroom = store.get_classroom(classroom_id, user_id=user['id'])
    
    if not classroom:
        return jsonify({
            'success': False,
            'error': 'Classroom not found'
        }), 404
    
    submissions = store.get_submissions(classroom_id)
    
    return jsonify({
        'success': True,
        'data': [
            {
                'id': s.id,
                'student_name': s.student_name,
                'file_name': s.file_name,
                'score': s.score,
                'performance_level': s.get_performance_level(),
                'performance_color': s.get_performance_color(),
                'date_submitted': s.date_submitted
            }
            for s in submissions
        ],
        'total': len(submissions)
    })


@classroom_bp.route('/classrooms/<classroom_id>/submissions/<submission_id>', methods=['GET'])
@login_required
def get_submission(classroom_id, submission_id):
    """Get detailed submission data"""
    user = get_current_user()
    classroom = store.get_classroom(classroom_id, user_id=user['id'])
    
    if not classroom:
        return jsonify({
            'success': False,
            'error': 'Classroom not found'
        }), 404
    
    submission = store.get_submission(classroom_id, submission_id)
    
    if not submission:
        return jsonify({
            'success': False,
            'error': 'Submission not found'
        }), 404
    
    return jsonify({
        'success': True,
        'data': {
            'id': submission.id,
            'student_name': submission.student_name,
            'file_name': submission.file_name,
            'score': submission.score,
            'feedback': submission.feedback,
            'mistakes': submission.mistakes,
            'suggestions': submission.suggestions,
            'performance_level': submission.get_performance_level(),
            'date_submitted': submission.date_submitted
        }
    })


@classroom_bp.route('/classrooms/<classroom_id>/regenerate-analytics', methods=['POST'])
@login_required
def regenerate_analytics(classroom_id):
    """Force regeneration of analytics"""
    user = get_current_user()
    classroom = store.get_classroom(classroom_id, user_id=user['id'])
    
    if not classroom:
        return jsonify({
            'success': False,
            'error': 'Classroom not found'
        }), 404
    
    analytics = generate_classroom_analytics(classroom_id)
    
    return jsonify({
        'success': True,
        'data': analytics,
        'message': 'Analytics regenerated successfully'
    })


# ==================== GOOGLE FORMS IMPORT ====================

def parse_google_forms_csv(csv_path):
    """
    Parse Google Forms CSV export and extract student responses.
    Returns list of dictionaries with student info and answers.
    """
    df = pd.read_csv(csv_path)
    students = []
    
    for idx, row in df.iterrows():
        # Extract student name from various possible columns
        name = row.get('Name', '') or row.get('Full Name', '') or row.get('Student Name', '')
        email = row.get('Email Address', '') or row.get('Username', '')
        
        # If no name column, try to extract from email
        if not name and email:
            name = email.split('@')[0].replace('.', ' ').replace('_', ' ').title()
        
        if not name:
            name = f"Student_{idx + 1}"
        
        # Collect all responses (skip metadata columns)
        skip_cols = ['Timestamp', 'Email Address', 'Username', 'Name', 'Full Name', 
                     'Student Name', 'Email', 'Score', 'Total Score']
        responses = {}
        for col in df.columns:
            if col not in skip_cols and pd.notna(row[col]):
                responses[col] = str(row[col])
        
        students.append({
            'name': name,
            'email': email,
            'roll_no': str(idx + 1),
            'responses': responses
        })
    
    return students




@classroom_bp.route('/classrooms/<classroom_id>/import-google-forms', methods=['POST'])
@login_required
def import_google_forms_classroom(classroom_id):
    """
    Import student responses from Google Forms CSV into a classroom (Demo Mode).
    Evaluates each response using the mock API.
    
    POST /classrooms/{id}/import-google-forms
    Content-Type: multipart/form-data
    
    Form Fields:
        - csv_file: Google Forms responses CSV (required)
        - max_score_per_question: (optional) Max score per question, default 10
    """
    try:
        user = get_current_user()
        classroom = store.get_classroom(classroom_id, user_id=user['id'])
        
        if not classroom:
            return jsonify({
                'success': False,
                'error': 'Classroom not found'
            }), 404
        
        # Check if file is present
        if 'csv_file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided',
                'message': 'Please upload a CSV file from Google Forms'
            }), 400
        
        csv_file = request.files['csv_file']
        
        if csv_file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected',
                'message': 'Please select a CSV file'
            }), 400
        
        if not csv_file.filename.endswith('.csv'):
            return jsonify({
                'success': False,
                'error': 'Invalid file type',
                'message': 'Please upload a CSV file (.csv)'
            }), 400
        
        # Save CSV temporarily
        filename = f"google_forms_{uuid.uuid4().hex}.csv"
        upload_folder = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, filename)
        csv_file.save(file_path)
        
        try:
            # Parse the CSV
            students = parse_google_forms_csv(file_path)
            
            if not students:
                return jsonify({
                    'success': False,
                    'error': 'No valid student responses found',
                    'message': 'The CSV appears to be empty or invalid'
                }), 400
            
            max_score = request.form.get('max_score_per_question', 10, type=int)
            
            # Process each student
            results = []
            failed_students = []
            
            for student in students:
                try:
                    # Evaluate each question-answer pair using mock LLM
                    total_score = 0
                    all_feedback = []
                    all_mistakes = []
                    all_suggestions = []
                    
                    for question, answer in student['responses'].items():
                        # Call mock LLM evaluation
                        context = f"Question: {question}"
                        evaluation = evaluate_assignment(answer, context)
                        
                        total_score += evaluation['score']
                        all_feedback.append(f"Q: {question}\n{evaluation['feedback']}")
                        all_mistakes.extend(evaluation['mistakes'])
                        all_suggestions.extend(evaluation['suggestions'])
                    
                    # Create submission
                    submission = Submission(
                        id=str(uuid.uuid4()),
                        student_name=student['name'],
                        file_name=f"Google Forms - {student['name']}",
                        score=total_score,
                        feedback="\n\n".join(all_feedback),
                        mistakes=list(set(all_mistakes)),
                        suggestions=list(set(all_suggestions)),
                        date_submitted=datetime.now().isoformat()
                    )
                    
                    store.add_submission(classroom_id, submission)
                    
                    results.append({
                        'submission_id': submission.id,
                        'student_name': student['name'],
                        'score': total_score,
                        'questions_answered': len(student['responses']),
                        'status': 'success'
                    })
                    
                except Exception as e:
                    print(f"Error processing student {student['name']}: {e}")
                    failed_students.append({
                        'student_name': student['name'],
                        'error': str(e)
                    })
            
            # Generate analytics
            analytics = generate_classroom_analytics(classroom_id)
            
            return jsonify({
                'success': True,
                'data': {
                    'processed': len(results),
                    'failed': len(failed_students),
                    'results': results,
                    'failed_students': failed_students,
                    'analytics': {
                        'overview': analytics['overview'],
                        'score_distribution': analytics['score_distribution'],
                        'pass_fail_ratio': analytics['pass_fail_ratio'],
                        'common_mistakes': analytics['common_mistakes'][:5]
                    },
                    'demo_mode': True
                },
                'message': f'Successfully imported and evaluated {len(results)} students from Google Forms (Demo Mode)'
            })
            
        finally:
            # Clean up temp file
            if os.path.exists(file_path):
                os.remove(file_path)
                
    except Exception as e:
        print(f"Google Forms import error: {e}")
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': f'An error occurred during import: {str(e)}'
        }), 500
