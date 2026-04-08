import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    UploadCloud, File, X, CheckCircle, AlertCircle, 
    FileText, Image as ImageIcon, FileSpreadsheet, ArrowRight, Brain
} from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import { storage } from '../services/api';

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

const Upload = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [assignmentName, setAssignmentName] = useState('');
    const [subject, setSubject] = useState('');
    const [error, setError] = useState(null);

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    }, []);

    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files);
        handleFiles(selectedFiles);
    };

    const handleFiles = (newFiles) => {
        const validFiles = newFiles.filter(file => {
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg'];
            return validTypes.includes(file.type);
        });

        const filesWithPreview = validFiles.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2),
            type: file.type,
            status: 'pending'
        }));

        setFiles(prev => [...prev, ...filesWithPreview]);
    };

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const getFileIcon = (type) => {
        if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
        if (type.includes('word') || type.includes('document')) return <FileText className="w-8 h-8 text-blue-500" />;
        if (type.includes('image')) return <ImageIcon className="w-8 h-8 text-green-500" />;
        return <File className="w-8 h-8 text-slate-500" />;
    };

    const handleEvaluate = async () => {
        if (files.length === 0) return;
        if (!assignmentName || !subject) return;
        
        setIsUploading(true);
        setError(null);
        setUploadProgress(10);
        
        try {
            // For single file evaluation, use the first file
            const fileToUpload = files[0].file;
            
            // Create FormData
            const formData = new FormData();
            formData.append('file', fileToUpload);
            formData.append('assignment_name', assignmentName);
            formData.append('subject', subject);
            
            setUploadProgress(30);
            
            // Send to backend
            const response = await fetch(`${API_BASE_URL}/evaluate`, {
                method: 'POST',
                body: formData,
            });
            
            setUploadProgress(70);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            setUploadProgress(100);
            
            if (result.success) {
                // Store evaluation data in localStorage for Results page (persists across refreshes)
                storage.setEvaluationResult({
                    ...result.data,
                    originalFileName: files[0].name
                });
                
                // Navigate to results page
                navigate('/results');
            } else {
                throw new Error(result.message || 'Evaluation failed');
            }
            
        } catch (err) {
            console.error('Evaluation error:', err);
            setError(err.message || 'An error occurred during evaluation. Please try again.');
            setIsUploading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-content max-w-4xl">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-4">
                        Upload <span className="text-gradient">Assignment</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Drag and drop files or click to browse. AI will handle the rest.
                    </p>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <div className="font-bold text-red-800 dark:text-red-300">Evaluation Failed</div>
                                <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Assignment Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <Card rotate={0} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Assignment Name *
                                </label>
                                <input
                                    type="text"
                                    value={assignmentName}
                                    onChange={(e) => setAssignmentName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ms-blue focus:outline-none transition-colors font-medium"
                                    placeholder="e.g., Math Quiz #5"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Subject *
                                </label>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ms-blue focus:outline-none transition-colors font-medium"
                                    required
                                >
                                    <option value="">Select subject</option>
                                    <option value="mathematics">Mathematics</option>
                                    <option value="science">Science</option>
                                    <option value="english">English</option>
                                    <option value="history">History</option>
                                    <option value="physics">Physics</option>
                                    <option value="chemistry">Chemistry</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Upload Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        className={`
                            relative border-4 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300
                            ${isDragging 
                                ? 'border-ms-blue bg-ms-blue/5 scale-[1.02]' 
                                : 'border-slate-300 dark:border-slate-700 hover:border-ms-blue/50'
                            }
                        `}
                    >
                        <input
                            type="file"
                            multiple
                            onChange={handleFileInput}
                            accept=".pdf,.docx,.png,.jpg,.jpeg"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        
                        <div className="relative z-10">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-ms-blue/10 flex items-center justify-center">
                                <UploadCloud className={`w-10 h-10 text-ms-blue transition-transform ${isDragging ? 'scale-110' : ''}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                            </h3>
                            <p className="text-slate-500 mb-4">
                                or click to browse from your computer
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold">
                                    PDF
                                </span>
                                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                                    DOCX
                                </span>
                                <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">
                                    PNG/JPG
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* File List */}
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6"
                    >
                        <Card rotate={0} className="p-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                Files to Process ({files.length})
                            </h3>
                            <div className="space-y-3">
                                {files.map((file) => (
                                    <div 
                                        key={file.id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800"
                                    >
                                        <div className="flex items-center gap-4">
                                            {getFileIcon(file.type)}
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white text-sm">
                                                    {file.name}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {file.size} MB
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(file.id)}
                                            disabled={isUploading}
                                            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Progress Bar */}
                            {isUploading && (
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <Brain className="w-4 h-4 text-ms-blue animate-pulse" />
                                            AI Processing...
                                        </span>
                                        <span className="text-sm font-bold text-ms-blue">{uploadProgress}%</span>
                                    </div>
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-ms-blue to-ms-violet transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Action Button */}
                            <button
                                onClick={handleEvaluate}
                                disabled={isUploading || !assignmentName || !subject}
                                className="w-full mt-6 py-4 bg-ms-blue text-white font-black text-lg rounded-xl border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Evaluate Assignment
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </Card>
                    </motion.div>
                )}

                {/* Tips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-ms-green/10 border-2 border-ms-green/30">
                        <CheckCircle className="w-5 h-5 text-ms-green flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <span className="font-bold text-slate-900 dark:text-white">Best results:</span>
                            <span className="text-slate-600 dark:text-slate-400 ml-1">Use clear, high-resolution scans</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-ms-blue/10 border-2 border-ms-blue/30">
                        <CheckCircle className="w-5 h-5 text-ms-blue flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <span className="font-bold text-slate-900 dark:text-white">Max size:</span>
                            <span className="text-slate-600 dark:text-slate-400 ml-1">10MB per file</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-ms-violet/10 border-2 border-ms-violet/30">
                        <AlertCircle className="w-5 h-5 text-ms-violet flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <span className="font-bold text-slate-900 dark:text-white">Privacy:</span>
                            <span className="text-slate-600 dark:text-slate-400 ml-1">Files auto-delete after 30 days</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Upload;
