"""
Authentication Routes - Login, Signup, Token management
"""

from flask import Blueprint, request, jsonify, session
from auth import auth_store, login_required, get_current_user

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/auth/register', methods=['POST'])
def register():
    """Register new user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        name = data.get('name', '').strip()
        
        # Validation
        if not email or not password or not name:
            return jsonify({
                'success': False,
                'error': 'Missing required fields',
                'message': 'Please provide name, email, and password'
            }), 400
        
        if len(password) < 6:
            return jsonify({
                'success': False,
                'error': 'Password too short',
                'message': 'Password must be at least 6 characters'
            }), 400
        
        # Check if user exists
        if auth_store.get_user(email):
            return jsonify({
                'success': False,
                'error': 'User already exists',
                'message': 'An account with this email already exists'
            }), 409
        
        # Create user
        user = auth_store.create_user(email, password, name)
        
        if not user:
            return jsonify({
                'success': False,
                'error': 'Registration failed',
                'message': 'Could not create user'
            }), 500
        
        # Create token
        token = auth_store.create_token(user['id'])
        
        # Store in session
        session['token'] = token
        session['user_id'] = user['id']
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'data': {
                'token': token,
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'name': user['name']
                }
            }
        }), 201
        
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': str(e)
        }), 500


@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        remember = data.get('remember', False)
        
        if not email or not password:
            return jsonify({
                'success': False,
                'error': 'Missing credentials',
                'message': 'Please provide email and password'
            }), 400
        
        # Get user
        user = auth_store.get_user(email)
        
        if not user:
            return jsonify({
                'success': False,
                'error': 'Invalid credentials',
                'message': 'Email or password is incorrect'
            }), 401
        
        # Verify password
        if not auth_store.verify_password(password, user['password_hash'], user['salt']):
            return jsonify({
                'success': False,
                'error': 'Invalid credentials',
                'message': 'Email or password is incorrect'
            }), 401
        
        # Create token
        token = auth_store.create_token(user['id'])
        
        # Store in session
        session['token'] = token
        session['user_id'] = user['id']
        session.permanent = remember
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'data': {
                'token': token,
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'name': user['name']
                }
            }
        })
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': str(e)
        }), 500


@auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    """Logout user"""
    try:
        token = session.get('token')
        if token:
            auth_store.revoke_token(token)
        
        session.clear()
        
        return jsonify({
            'success': True,
            'message': 'Logout successful'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@auth_bp.route('/auth/me', methods=['GET'])
@login_required
def get_me():
    """Get current user info"""
    user = get_current_user()
    return jsonify({
        'success': True,
        'data': {
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'created_at': user.get('created_at')
        }
    })


@auth_bp.route('/auth/verify', methods=['GET'])
def verify_token():
    """Verify if token is valid"""
    token = None
    
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization']
        try:
            token = auth_header.split(' ')[1]
        except IndexError:
            pass
    
    if not token:
        return jsonify({'success': False, 'error': 'No token provided'}), 401
    
    user = auth_store.verify_token(token)
    
    if not user:
        return jsonify({'success': False, 'error': 'Invalid token'}), 401
    
    return jsonify({
        'success': True,
        'data': {
            'user': {
                'id': user['id'],
                'email': user['email'],
                'name': user['name']
            }
        }
    })
