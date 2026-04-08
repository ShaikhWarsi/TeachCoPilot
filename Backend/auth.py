"""
Authentication Module - Simplified DEMO mode for hackathon
"""

import os
import uuid
import hashlib
import secrets
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from classroom_models import store

# DEMO MODE: Use fixed teacher ID for hackathon/demo
# In production, replace with proper authentication
DEMO_USER_ID = "teacher_001"
DEMO_USER = {
    'id': DEMO_USER_ID,
    'email': 'demo@teacher.com',
    'name': 'Demo Teacher'
}

# Simple in-memory user store (migrate to database in production)
class AuthStore:
    def __init__(self):
        self.users = {}  # email -> user dict
        self.tokens = {}  # token -> user_id mapping
        self._load_users()
    
    def _load_users(self):
        """Load users from file if exists"""
        import json
        path = os.path.join(os.path.dirname(__file__), 'users.json')
        if os.path.exists(path):
            try:
                with open(path, 'r') as f:
                    data = json.load(f)
                    self.users = data.get('users', {})
            except:
                pass
    
    def _save_users(self):
        """Save users to file"""
        import json
        path = os.path.join(os.path.dirname(__file__), 'users.json')
        try:
            with open(path, 'w') as f:
                json.dump({'users': self.users}, f, indent=2)
        except Exception as e:
            print(f"Error saving users: {e}")
    
    def hash_password(self, password: str, salt: str = None) -> tuple:
        """Hash password with salt"""
        if salt is None:
            salt = secrets.token_hex(16)
        pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return pwdhash.hex(), salt
    
    def verify_password(self, password: str, stored_hash: str, salt: str) -> bool:
        """Verify password against stored hash"""
        pwdhash, _ = self.hash_password(password, salt)
        return pwdhash == stored_hash
    
    def create_user(self, email: str, password: str, name: str) -> dict:
        """Create new user"""
        if email in self.users:
            return None
        
        user_id = str(uuid.uuid4())
        pwd_hash, salt = self.hash_password(password)
        
        user = {
            'id': user_id,
            'email': email,
            'name': name,
            'password_hash': pwd_hash,
            'salt': salt,
            'created_at': datetime.now().isoformat()
        }
        
        self.users[email] = user
        self._save_users()
        return user
    
    def get_user(self, email: str) -> dict:
        """Get user by email"""
        return self.users.get(email)
    
    def get_user_by_id(self, user_id: str) -> dict:
        """Get user by ID"""
        for user in self.users.values():
            if user['id'] == user_id:
                return user
        return None
    
    def create_token(self, user_id: str) -> str:
        """Create JWT-like token"""
        token = secrets.token_urlsafe(32)
        expires = (datetime.now() + timedelta(days=7)).isoformat()
        self.tokens[token] = {
            'user_id': user_id,
            'expires': expires
        }
        return token
    
    def verify_token(self, token: str) -> dict:
        """Verify token and return user"""
        if token not in self.tokens:
            return None
        
        token_data = self.tokens[token]
        expires = datetime.fromisoformat(token_data['expires'])
        
        if datetime.now() > expires:
            del self.tokens[token]
            return None
        
        return self.get_user_by_id(token_data['user_id'])
    
    def revoke_token(self, token: str):
        """Revoke token"""
        if token in self.tokens:
            del self.tokens[token]


# Global auth store
auth_store = AuthStore()


def login_required(f):
    """Decorator to protect routes - DEMO MODE: auto-authenticates as demo teacher"""
    @wraps(f)
    def decorated(*args, **kwargs):
        # DEMO MODE: Auto-authenticate as demo teacher
        # Remove this in production and use proper token validation below
        request.current_user = DEMO_USER
        return f(*args, **kwargs)
        
        # PRODUCTION CODE (uncomment when ready):
        # token = None
        # if 'Authorization' in request.headers:
        #     auth_header = request.headers['Authorization']
        #     try:
        #         token = auth_header.split(' ')[1]
        #     except IndexError:
        #         pass
        # 
        # if not token and 'token' in request.session:
        #     token = request.session['token']
        # 
        # if not token:
        #     return jsonify({'success': False, 'error': 'Authentication required'}), 401
        # 
        # user = auth_store.verify_token(token)
        # if not user:
        #     return jsonify({'success': False, 'error': 'Invalid or expired token'}), 401
        # 
        # request.current_user = user
        # return f(*args, **kwargs)
    
    return decorated


def get_current_user() -> dict:
    """Get current authenticated user"""
    return getattr(request, 'current_user', None)
