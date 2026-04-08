import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Plus, Users, BookOpen, Calendar, ArrowRight, 
    Trash2, BarChart3, Loader2, School
} from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';

const API_BASE_URL = 'https://rachit-tw-teco.hf.space/api';

const Classrooms = () => {
    const navigate = useNavigate();
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        assignment_title: ''
    });
    const [creating, setCreating] = useState(false);

    // Fetch classrooms on mount
    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/classrooms`);
            const result = await response.json();
            if (result.success) {
                setClassrooms(result.data);
            }
        } catch (error) {
            console.error('Error fetching classrooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/classrooms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            if (result.success) {
                setClassrooms([...classrooms, result.data]);
                setShowCreateModal(false);
                setFormData({ name: '', subject: '', assignment_title: '' });
                // Navigate to new classroom
                navigate(`/classroom/${result.data.id}`);
            }
        } catch (error) {
            console.error('Error creating classroom:', error);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure? This will delete all submissions.')) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/classrooms/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            if (result.success) {
                setClassrooms(classrooms.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error('Error deleting classroom:', error);
        }
    };

    const getSubjectColor = (subject) => {
        const colors = {
            'mathematics': 'bg-ms-blue',
            'science': 'bg-ms-green',
            'english': 'bg-ms-violet',
            'history': 'bg-ms-orange',
            'physics': 'bg-ms-yellow',
            'chemistry': 'bg-ms-neon'
        };
        return colors[subject?.toLowerCase()] || 'bg-ms-blue';
    };

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-ms-blue animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">Loading classrooms...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-content max-w-7xl">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-2">
                            My <span className="text-gradient">Classrooms</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            Manage classes and evaluate student assignments
                        </p>
                    </div>
                    
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-ms-blue text-white font-bold rounded-full border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Create Classroom
                    </button>
                </motion.div>

                {/* Stats Overview */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <Card rotate={1} className="text-center">
                        <div className="text-3xl font-black text-ms-blue">{classrooms.length}</div>
                        <div className="text-sm font-bold text-slate-500 uppercase">Classrooms</div>
                    </Card>
                    <Card rotate={-1} className="text-center">
                        <div className="text-3xl font-black text-ms-green">
                            {classrooms.reduce((acc, c) => acc + (c.stats?.total_students || 0), 0)}
                        </div>
                        <div className="text-sm font-bold text-slate-500 uppercase">Total Students</div>
                    </Card>
                    <Card rotate={1} className="text-center">
                        <div className="text-3xl font-black text-ms-violet">
                            {classrooms.reduce((acc, c) => acc + (c.stats?.evaluated_count || 0), 0)}
                        </div>
                        <div className="text-sm font-bold text-slate-500 uppercase">Evaluated</div>
                    </Card>
                    <Card rotate={-1} className="text-center">
                        <div className="text-3xl font-black text-ms-orange">
                            {classrooms.length > 0 
                                ? Math.round(classrooms.reduce((acc, c) => acc + (c.stats?.average_score || 0), 0) / classrooms.length)
                                : 0}
                        </div>
                        <div className="text-sm font-bold text-slate-500 uppercase">Avg Score</div>
                    </Card>
                </motion.div>

                {/* Classrooms Grid */}
                {classrooms.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <School className="w-24 h-24 text-slate-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            No Classrooms Yet
                        </h2>
                        <p className="text-slate-500 mb-6">
                            Create your first classroom to start evaluating assignments
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-ms-blue text-white font-bold rounded-full border-4 border-slate-900 shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
                        >
                            Create Your First Classroom
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classrooms.map((classroom, idx) => (
                            <motion.div
                                key={classroom.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card rotate={idx % 2 === 0 ? 1 : -1} className="h-full flex flex-col">
                                    {/* Header with subject color */}
                                    <div className={`h-2 ${getSubjectColor(classroom.subject)} rounded-full mb-4`} />
                                    
                                    <div className="flex-1">
                                        <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-1">
                                            {classroom.name}
                                        </h3>
                                        <p className="text-ms-blue font-bold text-sm mb-3">
                                            {classroom.subject}
                                        </p>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                                            {classroom.assignment_title}
                                        </p>
                                        
                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                                                <Users size={16} className="mx-auto mb-1 text-slate-400" />
                                                <div className="text-lg font-black text-slate-900 dark:text-white">
                                                    {classroom.stats?.total_students || 0}
                                                </div>
                                                <div className="text-xs text-slate-500">Students</div>
                                            </div>
                                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                                                <BarChart3 size={16} className="mx-auto mb-1 text-slate-400" />
                                                <div className="text-lg font-black text-ms-blue">
                                                    {Math.round(classroom.stats?.average_score || 0)}
                                                </div>
                                                <div className="text-xs text-slate-500">Avg Score</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex gap-2 mt-4">
                                        <Link
                                            to={`/classroom/${classroom.id}`}
                                            className="flex-1 py-2 bg-ms-blue text-white font-bold text-sm rounded-xl border-2 border-slate-900 dark:border-white hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-1"
                                        >
                                            Open
                                            <ArrowRight size={14} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(classroom.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-md"
                        >
                            <Card rotate={0} className="p-6">
                                <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-4">
                                    Create New Classroom
                                </h2>
                                
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                            Classroom Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-ms-blue focus:outline-none"
                                            placeholder="e.g., 10th Grade Math"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                            Subject *
                                        </label>
                                        <select
                                            value={formData.subject}
                                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-ms-blue focus:outline-none"
                                            required
                                        >
                                            <option value="">Select subject</option>
                                            <option value="Mathematics">Mathematics</option>
                                            <option value="Science">Science</option>
                                            <option value="English">English</option>
                                            <option value="History">History</option>
                                            <option value="Physics">Physics</option>
                                            <option value="Chemistry">Chemistry</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                            Assignment Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.assignment_title}
                                            onChange={(e) => setFormData({...formData, assignment_title: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-ms-blue focus:outline-none"
                                            placeholder="e.g., Quadratic Equations Quiz"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
                                            className="flex-1 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-ms-blue transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={creating}
                                            className="flex-1 py-3 bg-ms-blue text-white font-bold rounded-xl border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {creating ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                'Create'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Classrooms;
