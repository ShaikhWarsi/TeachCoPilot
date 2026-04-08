/**
 * API Service - Centralized API calls with authentication
 * Uses localStorage for persistent auth (not sessionStorage)
 * DEMO MODE: When token is 'demo_token', uses frontend-only mock APIs
 */

import { demoAPI } from './demoApi';

const API_BASE_URL = 'https://rachit-tw-teco.hf.space/api';

// Check mode: demo = mock data, test = real backend, normal = regular auth
const getMode = () => {
    const token = localStorage.getItem('token');
    if (token === 'demo_token') return 'demo';
    if (token === 'test_token') return 'test';
    return 'normal';
};
const isDemoMode = () => getMode() === 'demo';
const isTestMode = () => getMode() === 'test';

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
        isDemoMode() 
            ? demoAPI.auth.register(name, email, password)
            : apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            }),
    
    login: (email, password, remember = false) => 
        isDemoMode()
            ? demoAPI.auth.login()
            : apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password, remember })
            }),
    
    logout: () => 
        isDemoMode()
            ? demoAPI.auth.logout()
            : apiCall('/auth/logout', { method: 'POST' }),
    
    verifyToken: () => 
        isDemoMode()
            ? Promise.resolve({ success: true, data: { user: demoAPI.classroom.list().then(r => r.data) } })
            : apiCall('/auth/verify'),
    
    getMe: () => 
        isDemoMode()
            ? Promise.resolve({ success: true, data: { id: 'demo_teacher', name: 'Demo Teacher', email: 'demo@teachercopilot.com' } })
            : apiCall('/auth/me')
};

// ==================== CLASSROOM API ====================

export const classroomAPI = {
    list: () => 
        isDemoMode()
            ? demoAPI.classroom.list()
            : apiCall('/classrooms'),
    
    create: (name, subject, assignment_title) => 
        isDemoMode()
            ? demoAPI.classroom.create(name, subject, assignment_title)
            : apiCall('/classrooms', {
                method: 'POST',
                body: JSON.stringify({ name, subject, assignment_title })
            }),
    
    get: (id) => 
        isDemoMode()
            ? demoAPI.classroom.get(id)
            : apiCall(`/classrooms/${id}`),
    
    delete: (id) => 
        isDemoMode()
            ? demoAPI.classroom.delete(id)
            : apiCall(`/classrooms/${id}`, { method: 'DELETE' }),
    
    uploadBatch: (id, files, questionsFile = null) =>
        isDemoMode()
            ? demoAPI.classroom.uploadBatch(id, files, questionsFile)
            : (() => {
                const fd = new FormData();
                files.forEach(f => fd.append('files', f));
                if (questionsFile) {
                    fd.append('questions_file', questionsFile);
                }
                return apiCall(`/classrooms/${id}/upload`, { method: 'POST', body: fd });
            })(),
    
    importGoogleForms: (id, csvFile, maxScorePerQuestion = 10) =>
        isDemoMode()
            ? demoAPI.classroom.importGoogleForms(id, csvFile, maxScorePerQuestion)
            : apiCall(`/classrooms/${id}/import-google-forms`, {
                method: 'POST',
                body: (() => { const fd = new FormData(); fd.append('csv_file', csvFile); fd.append('max_score_per_question', maxScorePerQuestion); return fd; })()
            }),
    
    getSubmissions: (id) => 
        isDemoMode()
            ? demoAPI.classroom.getSubmissions(id)
            : apiCall(`/classrooms/${id}/submissions`),
    
    getSubmission: (classroomId, submissionId) => 
        isDemoMode()
            ? Promise.resolve({ success: true, data: null }) // Mock
            : apiCall(`/classrooms/${classroomId}/submissions/${submissionId}`),
    
    getAnalytics: (id) => 
        isDemoMode()
            ? demoAPI.classroom.getAnalytics(id)
            : apiCall(`/classrooms/${id}/analytics`)
};

// ==================== EVALUATION API ====================

export const evaluationAPI = {
    evaluate: (file, assignmentName, subject, questionsFile = null) =>
        isDemoMode()
            ? demoAPI.evaluation.evaluate(file, assignmentName, subject, questionsFile)
            : (() => {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('assignment_name', assignmentName);
                fd.append('subject', subject);
                if (questionsFile) {
                    fd.append('questions_file', questionsFile);
                }
                return apiCall('/evaluate', { method: 'POST', body: fd });
            })(),
    
    batchEvaluate: (files, assignmentName) =>
        isDemoMode()
            ? demoAPI.evaluation.batchEvaluate(files, assignmentName)
            : apiCall('/batch-evaluate', {
                method: 'POST',
                body: (() => { const fd = new FormData(); files.forEach(f => fd.append('files', f)); fd.append('assignment_name', assignmentName); return fd; })()
            }),
    
    importGoogleForms: (csvFile, totalMarks) =>
        isDemoMode()
            ? Promise.resolve({ success: true, data: { imported: 5 } }) // Mock
            : apiCall('/import-google-forms', {
                method: 'POST',
                body: (() => { const fd = new FormData(); fd.append('csv_file', csvFile); fd.append('total_marks', totalMarks); return fd; })()
            })
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
