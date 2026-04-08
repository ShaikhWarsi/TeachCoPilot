import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FileText, Clock, TrendingUp, AlertCircle, Plus, 
    ChevronRight, Brain, Star, Calendar, Users, Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import { classroomAPI, storage } from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    // Check auth and load data
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const currentUser = storage.getUser();
        setUser(currentUser);

        loadClassrooms();
    }, [navigate]);

    const loadClassrooms = async () => {
        try {
            setLoading(true);
            const response = await classroomAPI.list();
            
            if (response.success) {
                setClassrooms(response.data || []);
            } else {
                setError(response.error || 'Failed to load classrooms');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate real stats from classrooms
    const totalClassrooms = classrooms.length;
    const totalSubmissions = classrooms.reduce((sum, c) => sum + (c.stats?.submission_count || 0), 0);
    const avgScore = classrooms.length > 0 
        ? (classrooms.reduce((sum, c) => sum + (c.stats?.average_score || 0), 0) / classrooms.length).toFixed(1)
        : '0.0';

    const stats = [
        { icon: FileText, label: "Classrooms", value: totalClassrooms.toString(), change: "Active", color: "bg-ms-blue" },
        { icon: TrendingUp, label: "Average Score", value: avgScore, change: "Class avg", color: "bg-ms-green" },
        { icon: Users, label: "Submissions", value: totalSubmissions.toString(), change: "Evaluated", color: "bg-ms-orange" },
        { icon: Clock, label: "Time Saved", value: `${Math.floor(totalSubmissions * 5 / 60)}h`, change: "~5min each", color: "bg-ms-violet" }
    ];

    return (
        <div className="page-container">
            <div className="page-content">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-2">
                        Dashboard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        {user ? `Welcome back, ${user.name}!` : 'Welcome back!'} Here's what's happening with your classes.
                    </p>
                </motion.div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="mb-6 flex items-center gap-3 text-slate-500">
                        <Loader2 className="animate-spin" />
                        <span>Loading your classrooms...</span>
                    </div>
                )}

                {/* Quick Actions */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap gap-4 mb-8"
                >
                    <Link 
                        to="/classrooms"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-ms-blue text-white font-bold rounded-full border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
                    >
                        <Plus size={20} />
                        New Classroom
                    </Link>
                    <Link 
                        to="/classrooms"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-full border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
                    >
                        <Users size={20} />
                        View Classrooms
                    </Link>
                </motion.div>

                {/* Stats Grid */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {stats.map((stat, idx) => (
                        <Card key={idx} rotate={idx % 2 === 0 ? 1 : -1} className="relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-20 h-20 ${stat.color} opacity-20 rounded-bl-[2rem]`} />
                            <stat.icon className="w-8 h-8 text-slate-900 dark:text-white mb-3" />
                            <div className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</div>
                            <div className="text-xs font-bold text-ms-green">{stat.change} this month</div>
                        </Card>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Classrooms */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <Card rotate={0} className="h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white">
                                    Your Classrooms
                                </h2>
                                <Link to="/classrooms" className="text-ms-blue font-bold hover:underline flex items-center gap-1">
                                    View All <ChevronRight size={16} />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {classrooms.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500">
                                        <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                        <p>No classrooms yet.</p>
                                        <Link to="/classrooms" className="text-ms-blue font-bold hover:underline mt-2 inline-block">
                                            Create your first classroom →
                                        </Link>
                                    </div>
                                ) : (
                                    classrooms.slice(0, 5).map((classroom) => (
                                        <Link
                                            key={classroom.id}
                                            to={`/classroom/${classroom.id}`}
                                            className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-ms-blue/5 dark:hover:bg-ms-blue/10 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-ms-blue/10 flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-ms-blue" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-ms-blue transition-colors">
                                                        {classroom.name}
                                                    </div>
                                                    <div className="text-sm text-slate-500 flex items-center gap-2">
                                                        <span>{classroom.subject}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Users size={12} />
                                                            {classroom.stats?.submission_count || 0} students
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-black text-slate-900 dark:text-white">
                                                    {classroom.stats?.average_score?.toFixed(1) || '0.0'}%
                                                </div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1 justify-end">
                                                    <Calendar size={12} />
                                                    {new Date(classroom.date_created).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        {/* Quick Start */}
                        <Card rotate={1}>
                            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <AlertCircle className="text-ms-orange" size={24} />
                                Quick Start Guide
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-ms-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-ms-blue">1</span>
                                    </div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        <strong>Create a classroom</strong> - Set up your class with subject and assignment title
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-ms-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-ms-blue">2</span>
                                    </div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        <strong>Upload assignments</strong> - Drag and drop up to 30 student files at once
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-ms-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-ms-blue">3</span>
                                    </div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        <strong>View analytics</strong> - See class insights, scores, and common mistakes
                                    </span>
                                </div>
                            </div>
                            <Link 
                                to="/classrooms" 
                                className="mt-4 block text-center py-2 text-ms-blue font-bold hover:underline"
                            >
                                Get Started →
                            </Link>
                        </Card>

                        {/* AI Status */}
                        <Card rotate={-1} variant="colored" className="text-white">
                            <div className="flex items-center gap-3 mb-3">
                                <Brain className="w-8 h-8" />
                                <div>
                                    <div className="font-bold">AI Status</div>
                                    <div className="text-sm text-white/80">All systems operational</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-white text-white" />
                                ))}
                                <span className="ml-2 text-sm font-bold">99.9% Uptime</span>
                            </div>
                        </Card>

                        {/* Quick Tip */}
                        <Card rotate={0} className="bg-ms-yellow/10 border-ms-yellow">
                            <div className="text-sm">
                                <span className="font-bold text-ms-orange">Pro Tip:</span>
                                <span className="text-slate-700 dark:text-slate-300 ml-1">
                                    Upload assignments in PDF format for best AI extraction results.
                                </span>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
