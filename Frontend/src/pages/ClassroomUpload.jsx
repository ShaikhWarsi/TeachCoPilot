import React, { useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
    UploadCloud, File, X, CheckCircle, AlertCircle, 
    ChevronLeft, Loader2, Users, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';

const API_BASE_URL = 'http://localhost:5000/api';

const ClassroomUpload = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [results, setResults] = useState(null);
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
            const validTypes = [
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/png',
                'image/jpeg'
            ];
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
        if (type.includes('pdf')) return <File className="w-8 h-8 text-red-500" />;
        if (type.includes('word') || type.includes('document')) return <File className="w-8 h-8 text-blue-500" />;
        if (type.includes('image')) return <File className="w-8 h-8 text-green-500" />;
        return <File className="w-8 h-8 text-slate-500" />;
    };

    const handleBatchUpload = async () => {
        if (files.length === 0) return;
        
        setUploading(true);
        setError(null);
        setProgress({ current: 0, total: files.length });
        
        try {
            const formData = new FormData();
            files.forEach(f => formData.append('files', f.file));
            
            const response = await fetch(`${API_BASE_URL}/classrooms/${id}/upload`, {
                method: 'POST',
                body: formData,
            });
            
            const result = await response.json();
            
            if (result.success) {
                setResults(result.data);
                setProgress({ current: result.data.processed, total: files.length });
            } else {
                throw new Error(result.message || 'Upload failed');
            }
            
        } catch (err) {
            console.error('Batch upload error:', err);
            setError(err.message || 'An error occurred during upload');
        } finally {
            setUploading(false);
        }
    };

    const handleDone = () => {
        navigate(`/classroom/${id}/analytics`);
    };

    // Show results after upload
    if (results) {
        return (
            <div className="page-container">
                <div className="page-content max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-ms-green flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-display font-black text-slate-900 dark:text-white mb-2">
                            Upload Complete!
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Successfully processed {results.processed} of {files.length} files
                        </p>
                    </motion.div>

                    {/* Summary Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                    >
                        <Card rotate={1} className="text-center">
                            <div className="text-2xl font-black text-ms-blue">
                                {results.analytics?.overview?.average_score || 0}
                            </div>
                            <div className="text-xs font-bold text-slate-500 uppercase">Average</div>
                        </Card>
                        <Card rotate={-1} className="text-center">
                            <div className="text-2xl font-black text-ms-green">
                                {results.analytics?.overview?.highest_score || 0}
                            </div>
                            <div className="text-xs font-bold text-slate-500 uppercase">Highest</div>
                        </Card>
                        <Card rotate={1} className="text-center">
                            <div className="text-2xl font-black text-ms-orange">
                                {results.analytics?.overview?.lowest_score || 0}
                            </div>
                            <div className="text-xs font-bold text-slate-500 uppercase">Lowest</div>
                        </Card>
                        <Card rotate={-1} className="text-center">
                            <div className="text-2xl font-black text-ms-violet">
                                {results.analytics?.pass_fail_ratio?.passing_percentage || 0}%
                            </div>
                            <div className="text-xs font-bold text-slate-500 uppercase">Pass Rate</div>
                        </Card>
                    </motion.div>

                    {/* Common Mistakes Preview */}
                    {results.analytics?.common_mistakes?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-6"
                        >
                            <Card rotate={0}>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                    Top Issues Identified
                                </h3>
                                <div className="space-y-2">
                                    {results.analytics.common_mistakes.slice(0, 3).map((mistake, idx) => (
                                        <div 
                                            key={idx}
                                            className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800"
                                        >
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[70%]">
                                                {mistake.mistake}
                                            </span>
                                            <span className="px-2 py-1 rounded bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 text-xs font-bold">
                                                {mistake.frequency}% of students
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-4"
                    >
                        <button
                            onClick={handleDone}
                            className="flex-1 py-4 bg-ms-blue text-white font-black text-lg rounded-full border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            View Full Analytics
                            <ArrowRight size={20} />
                        </button>
                        <Link
                            to={`/classroom/${id}`}
                            className="px-6 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-full border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
                        >
                            Back to Classroom
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-content max-w-4xl">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link to={`/classroom/${id}`} className="text-slate-500 hover:text-ms-blue transition-colors flex items-center gap-2 font-medium">
                        <ChevronLeft size={16} />
                        Back to Classroom
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-4">
                        Batch <span className="text-gradient">Upload</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Upload multiple student assignments at once
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
                                <div className="font-bold text-red-800 dark:text-red-300">Upload Failed</div>
                                <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Upload Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
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
                            disabled={uploading}
                        />
                        
                        <div className="relative z-10">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-ms-blue/10 flex items-center justify-center">
                                <UploadCloud className={`w-10 h-10 text-ms-blue transition-transform ${isDragging ? 'scale-110' : ''}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {isDragging ? 'Drop files here' : 'Drag & drop multiple files'}
                            </h3>
                            <p className="text-slate-500 mb-4">
                                or click to browse. Select all student assignments.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold">PDF</span>
                                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">DOCX</span>
                                <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">Images</span>
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
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Files to Process ({files.length})
                                </h3>
                                {!uploading && (
                                    <button
                                        onClick={() => setFiles([])}
                                        className="text-sm text-red-500 hover:text-red-600 font-bold"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                            
                            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                                {files.map((file) => (
                                    <div 
                                        key={file.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800"
                                    >
                                        <div className="flex items-center gap-3">
                                            {getFileIcon(file.type)}
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white text-sm">
                                                    {file.name}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {file.size} MB • Student name extracted from filename
                                                </div>
                                            </div>
                                        </div>
                                        {!uploading && (
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Progress */}
                            {uploading && (
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-ms-blue" />
                                            Processing... {progress.current}/{progress.total}
                                        </span>
                                    </div>
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-ms-blue to-ms-violet transition-all duration-300"
                                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Each file is being OCR processed and evaluated by AI. This may take a few minutes.
                                    </p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={handleBatchUpload}
                                disabled={uploading}
                                className="w-full mt-6 py-4 bg-ms-blue text-white font-black text-lg rounded-xl border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Processing Class...
                                    </>
                                ) : (
                                    <>
                                        <Users size={20} />
                                        Evaluate {files.length} Students
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
                    transition={{ delay: 0.2 }}
                    className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-ms-green/10 border-2 border-ms-green/30">
                        <CheckCircle className="w-5 h-5 text-ms-green flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <span className="font-bold text-slate-900 dark:text-white">Naming:</span>
                            <span className="text-slate-600 dark:text-slate-400 ml-1">Filename becomes student name</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-ms-blue/10 border-2 border-ms-blue/30">
                        <CheckCircle className="w-5 h-5 text-ms-blue flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <span className="font-bold text-slate-900 dark:text-white">Formats:</span>
                            <span className="text-slate-600 dark:text-slate-400 ml-1">PDF, DOCX, PNG, JPG</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-ms-violet/10 border-2 border-ms-violet/30">
                        <AlertCircle className="w-5 h-5 text-ms-violet flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <span className="font-bold text-slate-900 dark:text-white">Batch:</span>
                            <span className="text-slate-600 dark:text-slate-400 ml-1">Upload up to 30 files at once</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ClassroomUpload;
