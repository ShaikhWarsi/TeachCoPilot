import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
    ChevronLeft, Users, BarChart3, TrendingUp, AlertTriangle,
    Award, BookOpen, Loader2, Download, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import Card from '../components/Card';

const API_BASE_URL = 'http://localhost:5000/api';

const COLORS = ['#00A4EF', '#7F00FF', '#7fba00', '#ffb900', '#f25022'];

const ClassroomAnalytics = () => {
    const { id } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [regenerating, setRegenerating] = useState(false);

    useEffect(() => {
        fetchAnalytics();
    }, [id]);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/classrooms/${id}/analytics`);
            const result = await response.json();
            if (result.success) {
                setAnalytics(result.data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async () => {
        setRegenerating(true);
        try {
            const response = await fetch(`${API_BASE_URL}/classrooms/${id}/regenerate-analytics`, {
                method: 'POST'
            });
            const result = await response.json();
            if (result.success) {
                setAnalytics(result.data);
            }
        } catch (error) {
            console.error('Error regenerating analytics:', error);
        } finally {
            setRegenerating(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#00A4EF';
        if (score >= 60) return '#7fba00';
        if (score >= 40) return '#ffb900';
        return '#f25022';
    };

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-ms-blue animate-spin" />
            </div>
        );
    }

    if (!analytics) return null;

    const { overview, score_distribution, pass_fail_ratio, common_mistakes, weakest_concepts, student_ranking, class_insight } = analytics;

    return (
        <div className="page-container">
            <div className="page-content max-w-7xl">
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
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-4xl font-display font-black text-slate-900 dark:text-white mb-2">
                            Class <span className="text-gradient">Analytics</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Performance insights and detailed statistics
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={handleRegenerate}
                            disabled={regenerating}
                            className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-ms-blue transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw size={18} className={regenerating ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                        <Link
                            to={`/api/classrooms/${id}/report`}
                            className="px-4 py-2 bg-ms-blue text-white font-bold rounded-xl border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center gap-2"
                        >
                            <Download size={18} />
                            Export CSV
                        </Link>
                    </div>
                </motion.div>

                {/* Overview Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
                >
                    <Card rotate={1} className="text-center">
                        <Users className="w-6 h-6 text-ms-blue mx-auto mb-2" />
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{overview.total_students}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Students</div>
                    </Card>
                    <Card rotate={-1} className="text-center">
                        <div className="text-2xl font-black text-ms-blue">{overview.average_score}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Average</div>
                    </Card>
                    <Card rotate={1} className="text-center">
                        <div className="text-2xl font-black text-ms-green">{overview.highest_score}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Highest</div>
                    </Card>
                    <Card rotate={-1} className="text-center">
                        <div className="text-2xl font-black text-ms-orange">{overview.lowest_score}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Lowest</div>
                    </Card>
                    <Card rotate={1} className="text-center">
                        <div className="text-2xl font-black text-ms-violet">{overview.passing_rate}%</div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Pass Rate</div>
                    </Card>
                    <Card rotate={-1} className="text-center">
                        <div className="text-2xl font-black text-red-500">{overview.at_risk_count}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase">At Risk</div>
                    </Card>
                </motion.div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Score Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card rotate={0} className="h-full">
                            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <BarChart3 className="text-ms-blue" />
                                Score Distribution
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={score_distribution}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="range" tick={{fontSize: 12}} />
                                        <YAxis />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        />
                                        <Bar dataKey="count" fill="#00A4EF" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Pass/Fail Ratio */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card rotate={0} className="h-full">
                            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <TrendingUp className="text-ms-green" />
                                Pass vs Fail
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Passing (≥60)', value: pass_fail_ratio.passing },
                                                { name: 'Failing (<60)', value: pass_fail_ratio.failing }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell fill="#7fba00" />
                                            <Cell fill="#f25022" />
                                        </Pie>
                                        <Legend />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Common Mistakes & Weakest Concepts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Common Mistakes */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card rotate={-1}>
                            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-ms-orange" />
                                Most Common Mistakes
                            </h3>
                            <div className="space-y-3">
                                {common_mistakes.slice(0, 5).map((mistake, idx) => (
                                    <div 
                                        key={idx}
                                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1">
                                                {mistake.mistake}
                                            </p>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                mistake.impact === 'high' ? 'bg-red-100 text-red-700' :
                                                mistake.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {mistake.frequency}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {mistake.count} students affected
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Weakest Concepts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card rotate={1}>
                            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <BookOpen className="text-ms-violet" />
                                Weakest Concepts
                            </h3>
                            <div className="space-y-3">
                                {weakest_concepts.map((concept, idx) => (
                                    <div 
                                        key={idx}
                                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                                                {concept.concept}
                                            </span>
                                            <span className="text-xs font-bold text-ms-orange">
                                                {concept.affected_students} students
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-ms-violet"
                                                style={{ width: `${concept.mastery_rate}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {concept.mastery_rate}% mastery rate
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Class Insight */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                >
                    <Card rotate={0} variant="colored">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    AI Class Insight
                                </h3>
                                <p className="text-white/90 leading-relaxed">
                                    {class_insight}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Top Performers */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Card rotate={0}>
                        <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Award className="text-ms-yellow" />
                            Student Rankings
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                        <th className="text-left py-3 px-4 font-bold text-slate-700 dark:text-slate-300">Rank</th>
                                        <th className="text-left py-3 px-4 font-bold text-slate-700 dark:text-slate-300">Student</th>
                                        <th className="text-left py-3 px-4 font-bold text-slate-700 dark:text-slate-300">Score</th>
                                        <th className="text-left py-3 px-4 font-bold text-slate-700 dark:text-slate-300">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {student_ranking.slice(0, 10).map((student) => (
                                        <tr 
                                            key={student.submission_id}
                                            className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                                    student.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                                                    student.rank === 2 ? 'bg-gray-300 text-gray-900' :
                                                    student.rank === 3 ? 'bg-orange-400 text-orange-900' :
                                                    'bg-slate-200 text-slate-700'
                                                }`}>
                                                    {student.rank}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                                                {student.student_name}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-lg font-black" style={{ color: getScoreColor(student.score) }}>
                                                    {Math.round(student.score)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                                                    student.performance_level === 'Excellent' ? 'bg-green-100 text-green-700 border-green-300' :
                                                    student.performance_level === 'Good' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                                    student.performance_level === 'Satisfactory' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                                                    student.performance_level === 'Needs Improvement' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                                                    'bg-red-100 text-red-700 border-red-300'
                                                }`}>
                                                    {student.performance_level}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default ClassroomAnalytics;
