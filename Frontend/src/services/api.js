/**
 * API Service - Centralized API calls with authentication
 * Uses localStorage for persistent auth (not sessionStorage)
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper for API calls
const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
            ...options.headers
        },
        credentials: 'include',
        ...options
    };
    
    // Don't set Content-Type for FormData
    if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        // Handle auth errors
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return { success: false, error: 'Session expired' };
        }
        
        return data;
    } catch (error) {
        return { 
            success: false, 
            error: 'Network error',
            message: error.message 
        };
    }
};

// ==================== AUTH API ====================

export const authAPI = {
    register: (name, email, password) => 
        apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        }),
    
    login: (email, password, remember = false) => 
        apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, remember })
        }),
    
    logout: () => 
        apiCall('/auth/logout', {
            method: 'POST'
        }),
    
    verifyToken: () => 
        apiCall('/auth/verify'),
    
    getMe: () => 
        apiCall('/auth/me')
};

// ==================== CLASSROOM API ====================

export const classroomAPI = {
    list: () => 
        apiCall('/classrooms'),
    
    create: (name, subject, assignment_title) => 
        apiCall('/classrooms', {
            method: 'POST',
            body: JSON.stringify({ name, subject, assignment_title })
        }),
    
    get: (id) => 
        apiCall(`/classrooms/${id}`),
    
    delete: (id) => 
        apiCall(`/classrooms/${id}`, {
            method: 'DELETE'
        }),
    
    uploadBatch: (id, files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        return apiCall(`/classrooms/${id}/upload`, {
            method: 'POST',
            body: formData
        });
    },
    
    getSubmissions: (id) => 
        apiCall(`/classrooms/${id}/submissions`),
    
    getSubmission: (classroomId, submissionId) => 
        apiCall(`/classrooms/${classroomId}/submissions/${submissionId}`),
    
    getAnalytics: (id) => 
        apiCall(`/classrooms/${id}/analytics`)
};

// ==================== EVALUATION API ====================

export const evaluationAPI = {
    evaluate: (file, assignmentName, subject) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('assignment_name', assignmentName);
        formData.append('subject', subject);
        return apiCall('/evaluate', {
            method: 'POST',
            body: formData
        });
    },
    
    batchEvaluate: (files, assignmentName) => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        formData.append('assignment_name', assignmentName);
        return apiCall('/batch-evaluate', {
            method: 'POST',
            body: formData
        });
    }
};

// ==================== STORAGE HELPERS ====================

export const storage = {
    setAuth: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },
    
    clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('evaluationResult');
    },
    
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    setEvaluationResult: (data) => {
        localStorage.setItem('evaluationResult', JSON.stringify(data));
    },
    
    getEvaluationResult: () => {
        const data = localStorage.getItem('evaluationResult');
        return data ? JSON.parse(data) : null;
    },
    
    clearEvaluationResult: () => {
        localStorage.removeItem('evaluationResult');
    }
};

export default { authAPI, classroomAPI, evaluationAPI, storage, apiCall };
