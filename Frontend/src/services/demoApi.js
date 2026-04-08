/**
 * Demo API Service - Frontend-only mock data
 * No backend required - everything stored in localStorage
 */

const DEMO_STORAGE_KEY = 'edu_evaluator_demo_data';

// Initialize demo data
const getDemoData = () => {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return {
        classrooms: [],
        submissions: {},
        user: {
            id: 'demo_teacher',
            name: 'Demo Teacher',
            email: 'demo@teachercopilot.com'
        }
    };
};

const saveDemoData = (data) => {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
};

// Demo Auth API
export const demoAuthAPI = {
    login: async () => ({
        success: true,
        data: {
            token: 'demo_token',
            user: getDemoData().user
        }
    }),
    
    register: async (name, email, password) => ({
        success: true,
        data: {
            token: 'demo_token',
            user: { ...getDemoData().user, name, email }
        }
    }),
    
    logout: async () => {
        localStorage.removeItem(DEMO_STORAGE_KEY);
        return { success: true };
    }
};

// Demo Classroom API
export const demoClassroomAPI = {
    list: async () => {
        const data = getDemoData();
        return {
            success: true,
            data: data.classrooms.map(c => ({
                ...c,
                stats: {
                    total_students: (data.submissions[c.id] || []).length,
                    average_score: data.submissions[c.id]?.length 
                        ? Math.round(data.submissions[c.id].reduce((acc, s) => acc + (s.score || 0), 0) / data.submissions[c.id].length)
                        : 0,
                    evaluated_count: (data.submissions[c.id] || []).length
                }
            }))
        };
    },
    
    create: async (name, subject, assignment_title) => {
        const data = getDemoData();
        const newClassroom = {
            id: 'class_' + Date.now(),
            name,
            subject,
            assignment_title,
            date_created: new Date().toISOString(),
            user_id: 'demo_teacher'
        };
        data.classrooms.push(newClassroom);
        data.submissions[newClassroom.id] = [];
        saveDemoData(data);
        return { success: true, data: newClassroom };
    },
    
    get: async (id) => {
        const data = getDemoData();
        const classroom = data.classrooms.find(c => c.id === id);
        if (!classroom) return { success: false, error: 'Classroom not found' };
        return {
            success: true,
            data: {
                ...classroom,
                submission_count: (data.submissions[id] || []).length
            }
        };
    },
    
    delete: async (id) => {
        const data = getDemoData();
        data.classrooms = data.classrooms.filter(c => c.id !== id);
        delete data.submissions[id];
        saveDemoData(data);
        return { success: true };
    },
    
    uploadBatch: async (id, files) => {
        const data = getDemoData();
        const submissions = [];
        
        for (const file of files) {
            const studentName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const mockScore = Math.floor(Math.random() * 40) + 60; // Random 60-100
            
            const submission = {
                id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                student_name: studentName,
                file_name: file.name,
                score: mockScore,
                feedback: `Mock evaluation for ${studentName}. Score: ${mockScore}/100`,
                mistakes: ['Mock mistake 1', 'Mock mistake 2'],
                suggestions: ['Practice more', 'Review concepts'],
                date_submitted: new Date().toISOString()
            };
            
            if (!data.submissions[id]) data.submissions[id] = [];
            data.submissions[id].push(submission);
            submissions.push(submission);
        }
        
        saveDemoData(data);
        
        // Generate simple analytics
        const scores = submissions.map(s => s.score);
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        
        return {
            success: true,
            data: {
                processed: submissions.length,
                failed: 0,
                results: submissions,
                analytics: {
                    overview: { average_score: avg, highest_score: Math.max(...scores, 0), lowest_score: Math.min(...scores, 100) },
                    score_distribution: { '0-50': 0, '51-70': 0, '71-90': submissions.length, '91-100': 0 },
                    pass_fail_ratio: { passing_percentage: 100 },
                    common_mistakes: [
                        { mistake: 'Calculation errors', frequency: 35 },
                        { mistake: 'Incomplete explanations', frequency: 28 },
                        { mistake: 'Missing key concepts', frequency: 22 }
                    ]
                }
            }
        };
    },
    
    importGoogleForms: async (id, csvFile, maxScorePerQuestion = 10) => {
        // Parse CSV simple
        const text = await csvFile.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        const data = getDemoData();
        const submissions = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(',');
            const name = values[2] || `Student ${i}`;
            
            const mockScore = Math.floor(Math.random() * 30) + 70;
            const submission = {
                id: 'sub_' + Date.now() + '_' + i,
                student_name: name,
                file_name: `Google Forms - ${name}`,
                score: mockScore,
                feedback: `Imported from Google Forms. Score: ${mockScore}/100`,
                mistakes: [],
                suggestions: ['Good work!'],
                date_submitted: new Date().toISOString()
            };
            
            if (!data.submissions[id]) data.submissions[id] = [];
            data.submissions[id].push(submission);
            submissions.push(submission);
        }
        
        saveDemoData(data);
        
        return {
            success: true,
            data: {
                processed: submissions.length,
                failed: 0,
                total: files.length,
                questions_provided: hasQuestions,
                questions_text_length: hasQuestions ? 1250 : 0,
                results: submissions,
                analytics: {
                    overview: { average_score: 75, highest_score: 95, lowest_score: 60 },
                    score_distribution: { '0-50': 0, '51-70': 1, '71-90': submissions.length - 1, '91-100': 0 },
                    pass_fail_ratio: { passing_percentage: 100 },
                    common_mistakes: hasQuestions
                        ? [
                            { mistake: 'Question 1: Incorrect formula', frequency: 40 },
                            { mistake: 'Question 3: Missing steps', frequency: 35 },
                            { mistake: 'Question 5: Wrong conclusion', frequency: 25 }
                        ]
                        : [
                            { mistake: 'Grammar and spelling errors', frequency: 30 },
                            { mistake: 'Short answers lacking detail', frequency: 25 },
                            { mistake: 'Missing examples', frequency: 20 }
                        ]
                }
            }
        };
    },
    
    getSubmissions: async (id) => {
        const data = getDemoData();
        const subs = data.submissions[id] || [];
        return {
            success: true,
            data: subs.map(s => ({
                ...s,
                performance_level: s.score >= 90 ? 'Excellent' : s.score >= 70 ? 'Good' : 'Needs Improvement',
                performance_color: s.score >= 90 ? 'green' : s.score >= 70 ? 'blue' : 'yellow'
            })),
            total: subs.length
        };
    },
    
    getAnalytics: async (id) => {
        const data = getDemoData();
        const subs = data.submissions[id] || [];
        const scores = subs.map(s => s.score);
        
        return {
            success: true,
            data: {
                overview: {
                    total_students: subs.length,
                    evaluated_count: subs.length,
                    average_score: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
                    highest_score: Math.max(...scores, 0),
                    lowest_score: Math.min(...scores, 100),
                    median_score: scores.length ? scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)] : 0
                },
                score_distribution: {
                    '0-50': subs.filter(s => s.score <= 50).length,
                    '51-70': subs.filter(s => s.score > 50 && s.score <= 70).length,
                    '71-90': subs.filter(s => s.score > 70 && s.score <= 90).length,
                    '91-100': subs.filter(s => s.score > 90).length
                },
                pass_fail_ratio: {
                    passing: subs.filter(s => s.score >= 60).length,
                    failing: subs.filter(s => s.score < 60).length,
                    passing_percentage: subs.length ? Math.round((subs.filter(s => s.score >= 60).length / subs.length) * 100) : 0
                },
                common_mistakes: subs.length ? [
                    { mistake: 'Calculation errors', frequency: 30, count: Math.ceil(subs.length * 0.3), impact: 'high' },
                    { mistake: 'Incomplete answers', frequency: 25, count: Math.ceil(subs.length * 0.25), impact: 'medium' },
                    { mistake: 'Concept misunderstanding', frequency: 20, count: Math.ceil(subs.length * 0.2), impact: 'medium' }
                ] : [],
                weakest_concepts: subs.length ? [
                    { concept: 'Algebra Basics', affected_students: Math.ceil(subs.length * 0.4), mastery_rate: 65 },
                    { concept: 'Problem Solving', affected_students: Math.ceil(subs.length * 0.3), mastery_rate: 72 },
                    { concept: 'Critical Thinking', affected_students: Math.ceil(subs.length * 0.35), mastery_rate: 68 }
                ] : [],
                submissions: subs
            }
        };
    }
};

// Demo Evaluation API  
export const demoEvaluationAPI = {
    evaluate: async (file, assignmentName, subject, questionsFile = null) => {
        // Mock evaluation - no actual backend call
        await new Promise(r => setTimeout(r, 1500)); // Simulate processing
        
        const mockScore = Math.floor(Math.random() * 40) + 60;
        const hasQuestions = questionsFile !== null;
        
        return {
            success: true,
            data: {
                score: mockScore,
                feedback: hasQuestions 
                    ? `Good work on ${assignmentName}! Your answers were evaluated against the provided questions.`
                    : `Good work on ${assignmentName}! Your understanding of ${subject} is solid.`,
                mistakes: hasQuestions 
                    ? ['Question 3: Incorrect formula used', 'Question 5: Missing explanation']
                    : ['Minor calculation error in section 2', 'Could expand more on key concepts'],
                suggestions: hasQuestions
                    ? ['Review the answer key for Question 3', 'Add more detail to Question 5 explanation']
                    : ['Review chapter 3 for deeper understanding', 'Practice more problem sets'],
                assignment_name: assignmentName,
                subject: subject,
                questions_provided: hasQuestions,
                questions_text_length: hasQuestions ? 1250 : 0
            }
        };
    },
    
    batchEvaluate: async (files, assignmentName) => {
        await new Promise(r => setTimeout(r, 2000));
        
        const results = files.map(() => Math.floor(Math.random() * 40) + 60);
        const avg = Math.round(results.reduce((a, b) => a + b, 0) / results.length);
        
        return {
            success: true,
            data: {
                average_score: avg,
                total_evaluated: files.length,
                common_mistakes: [
                    { mistake: 'Formatting issues', frequency: 40 },
                    { mistake: 'Incomplete answers', frequency: 30 }
                ],
                summary: `Successfully evaluated ${files.length} assignments with average score of ${avg}.`
            }
        };
    }
};

// Export combined demo API
export const demoAPI = {
    auth: demoAuthAPI,
    classroom: demoClassroomAPI,
    evaluation: demoEvaluationAPI
};
