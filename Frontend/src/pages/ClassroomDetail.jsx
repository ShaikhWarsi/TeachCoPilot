import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, Users, Upload, BarChart3, ArrowRight,
    Loader2, School, Calendar, BookOpen, Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';

const API_BASE_URL = 'http://localhost:5000/api';

const ClassroomDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [classroom, setClassroom] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClassroomData();
    }, [id]);

    const fetchClassroomData = async () => {
        try {
            // Fetch classroom details
            const classResponse = await fetch(`${API_BASE_URL}/classrooms/${id}`);
            const classResult = await classResponse.json();
            
            if (classResult.success) {
                setClassroom(classResult.data);
            } else {
                navigate('/classrooms');
                return;
            }

            // Fetch submissions
            const subResponse = await fetch(`${API_BASE_URL}/classrooms/${id}/submissions`);
            const subResult = await subResponse.json();
            
            if (subResult.success) {
                setSubmissions(subResult.data);
            }
        } catch (error) {
            console.error('Error fetching classroom:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPerformanceBadge = (level) => {
        const styles = {
            'Excellent': 'bg-green-100 text-green-700 border-green-300',
            'Good': 'bg-blue-100 text-blue-700 border-blue-300',
            'Satisfactory': 'bg-yellow-100 text-yellow-700 border-yellow-300',
            'Needs Improvement': 'bg-orange-100 text-orange-700 border-orange-300',
            'At Risk': 'bg-red-100 text-red-700 border-red-300'
        };
        return styles[level] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-ms-blue animate-spin" />
            </div>
        );
    }

    if (!classroom) return null;

    return (
        <div className="page-container">
            <div className="page-content max-w-6xl">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link to="/classrooms" className="text-slate-500 hover:text-ms-blue transition-colors flex items-center gap-2 font-medium">
                        <ChevronLeft size={16} />
                        Back to Classrooms
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-display font-black text-slate-900 dark:text-white mb-2">
                                {classroom.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                    <BookOpen size={16} className="text-ms-blue" />
                                    {classroom.subject}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={16} className="text-ms-violet" />
                                    {new Date(classroom.date_created).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                                {classroom.assignment_title}
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            <Link
                                to={`/classroom/${id}/upload`}
                                className="px-6 py-3 bg-ms-blue text-white font-bold rounded-full border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center gap-2"
                            >
                                <Upload size={18} />
                                Upload Assignments
                            </Link>
                            <Link
                                to={`/classroom/${id}/analytics`}
                                className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-full border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center gap-2"
                            >
                                <BarChart3 size={18} />
                                Analytics
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <Card rotate={1} className="text-center">
                        <Users className="w-8 h-8 text-ms-blue mx-auto mb-2" />
                        <div className="text-3xl font-black text-slate-900 dark:text-white">
                            {classroom.stats?.total_students || 0}
                        </div>
                        <div className="text-sm font-bold text-slate-500 uppercase">Students</div>
                    </Card>
                    
                    <Card rotate={-1} className="text-center">
                        <div className="text-3xl font-black text-ms-green">
                            {Math.round(classroom.stats?.average_score || 0)}
                        </div>
                        <div className="text-sm font-bold text-slate-500 uppercase">Average</div>
                    </Card>
                    
                    <Card rotate={1} className="text-center">
                        <div className="text-3xl font-black text-ms-violet">
                            {classroom.stats?.evaluated_count || 0}
                        </div>
                        <div className="text-sm font-bold text-slate-500 uppercase">Evaluated</div>
                    </Card>
                    
                    <Card rotate={-1} className="text-center">
                        <div className="text-3xl font-black text-ms-orange">
                            {submissions.length > 0 
                                ? Math.round((submissions.filter(s => s.score >= 60).length / submissions.length) * 100)
                                : 0}%
                        </div>
                        <div className="text-sm font-bold text-slate-500 uppercase">Pass Rate</div>
                    </Card>
                </motion.div>

                {/* Student Submissions Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card rotate={0}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white">
                                Student Submissions
                            </h2>
                            <span className="text-sm text-slate-500">
                                {submissions.length} total
                            </span>
                        </div>

                        {submissions.length === 0 ? (
                            <div className="text-center py-12">
                                <School className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 mb-4">No submissions yet</p>
                                <Link
                                    to={`/classroom/${id}/upload`}
                                    className="px-4 py-2 bg-ms-blue text-white font-bold rounded-full text-sm"
                                >
                                    Upload First Assignments
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                            <th className="text-left py-3 px-4 font-bold text-slate-700 dark:text-slate-300">Rank</th>
                                            <th className="text-left py-3 px-4 font-bold text-slate-700 dark:text-slate-300">Student</th>
                                            <th className="text-left py-3 px-4 font-bold text-slate-700 dark:text-slate-300">Score</th>
                                            <th className="text-left py-3 px-4 font-bold text-slate-700 dark:text-slate-300">Performance</th>
                                            <th className="text-right py-3 px-4 font-bold text-slate-700 dark:text-slate-300">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...submissions]
                                            .sort((a, b) => b.score - a.score)
                                            .map((sub, idx) => (
                                            <tr 
                                                key={sub.id}
                                                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                                        idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                                                        idx === 1 ? 'bg-gray-300 text-gray-900' :
                                                        idx === 2 ? 'bg-orange-400 text-orange-900' :
                                                        'bg-slate-200 text-slate-700'
                                                    }`}>
                                                        {idx + 1}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-bold text-slate-900 dark:text-white">
                                                        {sub.student_name}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {sub.file_name}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-xl font-black text-ms-blue">
                                                        {Math.round(sub.score)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPerformanceBadge(sub.performance_level)}`}>
                                                        {sub.performance_level}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Link
                                                        to={`/classroom/${id}/submission/${sub.id}`}
                                                        className="text-ms-blue font-bold hover:underline text-sm"
                                                    >
                                                        View →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 flex flex-wrap gap-4"
                >
                    <Link
                        to={`/classroom/${id}/analytics`}
                        className="flex-1 min-w-[200px] p-6 rounded-2xl border-4 border-slate-900 dark:border-white bg-ms-violet text-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
                    >
                        <BarChart3 className="w-8 h-8 mb-2" />
                        <h3 className="font-bold text-lg">View Analytics</h3>
                        <p className="text-sm text-white/80">Detailed insights and charts</p>
                    </Link>
                    
                    <Link
                        to={`/classroom/${id}/upload`}
                        className="flex-1 min-w-[200px] p-6 rounded-2xl border-4 border-slate-900 dark:border-white bg-ms-green text-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
                    >
                        <Upload className="w-8 h-8 mb-2" />
                        <h3 className="font-bold text-lg">Add More</h3>
                        <p className="text-sm text-white/80">Upload more assignments</p>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default ClassroomDetail;
