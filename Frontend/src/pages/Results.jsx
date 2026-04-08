import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, Download, Share2, CheckCircle, XCircle, 
    AlertTriangle, Lightbulb, Sparkles, Star, ArrowRight,
    FileText, BarChart3, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';

const Results = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('feedback');
    const [evaluationData, setEvaluationData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load evaluation data from localStorage (persists across refreshes)
    useEffect(() => {
        const storedData = localStorage.getItem('evaluationResult');
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                setEvaluationData(parsed);
            } catch (e) {
                console.error('Failed to parse evaluation data:', e);
            }
        }
        setLoading(false);
    }, []);

    // Redirect to upload if no data
    useEffect(() => {
        if (!loading && !evaluationData) {
            navigate('/upload');
        }
    }, [loading, evaluationData, navigate]);

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-ms-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">Loading results...</p>
                </div>
            </div>
        );
    }

    if (!evaluationData) {
        return null; // Will redirect
    }

    // Get score color based on value
    const getScoreColor = (score) => {
        if (score >= 90) return 'text-ms-green';
        if (score >= 80) return 'text-ms-blue';
        if (score >= 70) return 'text-ms-yellow';
        return 'text-ms-orange';
    };

    const getScoreLabel = (score) => {
        if (score >= 90) return 'Excellent';
        if (score >= 80) return 'Good';
        if (score >= 70) return 'Satisfactory';
        if (score >= 60) return 'Needs Improvement';
        return 'Poor';
    };

    return (
        <div className="page-container">
            <div className="page-content max-w-6xl">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link to="/upload" className="text-slate-500 hover:text-ms-blue transition-colors flex items-center gap-2 font-medium mb-4">
                        <ChevronLeft size={16} />
                        Evaluate Another
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white">
                                Evaluation Results
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                {evaluationData.assignment_name || 'Assignment'} • {evaluationData.subject || 'General'}
                            </p>
                            {evaluationData.originalFileName && (
                                <p className="text-xs text-slate-500 mt-1">
                                    File: {evaluationData.originalFileName}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-ms-blue transition-colors flex items-center gap-2">
                                <Share2 size={18} />
                                Share
                            </button>
                            <button className="px-4 py-2 bg-ms-blue text-white font-bold rounded-xl border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center gap-2">
                                <Download size={18} />
                                Export
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Score Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card rotate={0} variant="colored" className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className={`text-6xl font-black text-white ${getScoreColor(evaluationData.score)}`}>
                                    {Math.round(evaluationData.score)}
                                </div>
                                <div className="text-white/80 font-bold uppercase tracking-wider text-sm mt-1">Score (0-100)</div>
                                <div className="text-white/60 text-xs mt-1">{getScoreLabel(evaluationData.score)}</div>
                            </div>
                            <div className="md:col-span-2 flex flex-col justify-center">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    AI Feedback Summary
                                </h3>
                                <p className="text-white/90 leading-relaxed">
                                    {evaluationData.feedback || 'No feedback available'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {['feedback', 'mistakes', 'suggestions'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all border-4 ${
                                activeTab === tab 
                                    ? 'bg-ms-blue text-white border-slate-900 dark:border-white shadow-brutal' 
                                    : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-ms-blue'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'feedback' && (
                        <Card rotate={0}>
                            <div className="prose dark:prose-invert max-w-none">
                                <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Sparkles className="text-ms-violet" />
                                    AI Feedback
                                </h3>
                                <div className="p-6 rounded-xl bg-ms-blue/5 border-2 border-ms-blue/20 mb-6">
                                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {evaluationData.feedback || 'No feedback available'}
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-xl bg-ms-green/10 border-2 border-ms-green/30">
                                        <h4 className="font-bold text-ms-green mb-2 flex items-center gap-2">
                                            <CheckCircle size={18} />
                                            Score Interpretation
                                        </h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            A score of {Math.round(evaluationData.score)} indicates <span className="font-bold">{getScoreLabel(evaluationData.score)}</span> performance.
                                            {evaluationData.score >= 80 
                                                ? ' The student demonstrates strong understanding of the material.' 
                                                : evaluationData.score >= 60 
                                                    ? ' The student shows foundational knowledge but has room for improvement.' 
                                                    : ' The student would benefit from additional review and practice.'}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-ms-blue/10 border-2 border-ms-blue/30">
                                        <h4 className="font-bold text-ms-blue mb-2 flex items-center gap-2">
                                            <Info size={18} />
                                            Evaluation Details
                                        </h4>
                                        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                            <li>Subject: {evaluationData.subject || 'General'}</li>
                                            <li>Extracted Text: {evaluationData.extracted_text_length || 0} characters</li>
                                            <li>Score Range: 0-100</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'mistakes' && (
                        <div className="space-y-4">
                            {evaluationData.mistakes && evaluationData.mistakes.length > 0 ? (
                                evaluationData.mistakes.map((mistake, idx) => (
                                    <Card key={idx} rotate={idx % 2 === 0 ? 1 : -1}>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-ms-orange/10 flex items-center justify-center flex-shrink-0">
                                                <XCircle className="w-6 h-6 text-ms-orange" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
                                                    Mistake {idx + 1}
                                                </h3>
                                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                    {mistake}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <Card rotate={0} className="text-center py-12">
                                    <CheckCircle className="w-16 h-16 text-ms-green mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                        No Major Mistakes Found!
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        The submission appears to be well done with no significant errors identified.
                                    </p>
                                </Card>
                            )}
                        </div>
                    )}

                    {activeTab === 'suggestions' && (
                        <div className="space-y-4">
                            {evaluationData.suggestions && evaluationData.suggestions.length > 0 ? (
                                evaluationData.suggestions.map((suggestion, idx) => (
                                    <Card key={idx} rotate={idx % 2 === 0 ? -1 : 1}>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-ms-green/10 flex items-center justify-center flex-shrink-0">
                                                <Lightbulb className="w-6 h-6 text-ms-green" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
                                                    Suggestion {idx + 1}
                                                </h3>
                                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                    {suggestion}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <Card rotate={0} className="text-center py-12">
                                    <Sparkles className="w-16 h-16 text-ms-violet mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                        No Specific Suggestions
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        The submission is comprehensive. Keep up the good work!
                                    </p>
                                </Card>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <Link 
                        to="/upload"
                        className="px-6 py-3 bg-ms-violet text-white font-bold rounded-full border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center gap-2"
                    >
                        <FileText size={18} />
                        Evaluate Another
                    </Link>
                    <Link 
                        to="/insights"
                        className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-full border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center gap-2"
                    >
                        <BarChart3 size={18} />
                        View Insights
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Results;
