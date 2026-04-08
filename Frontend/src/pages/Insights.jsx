import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    BarChart3, TrendingUp, Users, Calendar, Download, 
    ChevronLeft, Target, Zap, BookOpen, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import Card from '../components/Card';

const Insights = () => {
    // Note: This page is deprecated - analytics are now in Classroom Detail pages
    // Redirect message instead of mock data
    const features = [
        { 
            icon: BarChart3, 
            title: "Classroom Analytics", 
            desc: "View detailed analytics for each classroom including score distributions and common mistakes.",
            link: "/classrooms",
            action: "View Classrooms"
        },
        { 
            icon: Users, 
            title: "Student Rankings", 
            desc: "See how students compare with detailed performance metrics and improvement suggestions.",
            link: "/classrooms",
            action: "Go to Classrooms"
        },
        { 
            icon: Target, 
            title: "Common Mistakes", 
            desc: "Identify patterns in student errors and get AI-powered recommendations.",
            link: "/classrooms",
            action: "View Analytics"
        },
    ];

    return (
        <div className="page-container">
            <div className="page-content max-w-7xl">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link to="/dashboard" className="text-slate-500 hover:text-ms-blue transition-colors flex items-center gap-2 font-medium mb-4">
                        <ChevronLeft size={16} />
                        Back to Dashboard
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white">
                                Class <span className="text-gradient">Insights</span>
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Data-driven analysis to improve student outcomes
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link 
                                to="/classrooms"
                                className="px-6 py-3 bg-ms-blue text-white font-bold rounded-xl border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center gap-2"
                            >
                                <ArrowRight size={18} />
                                Go to Classrooms
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Redirect Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <Card rotate={0} className="bg-ms-yellow/20 border-ms-yellow">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-ms-yellow flex items-center justify-center flex-shrink-0">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-2">
                                    Analytics Have Moved!
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    Detailed analytics are now available in each classroom. 
                                    Create a classroom, upload assignments, and view analytics 
                                    specific to that class.
                                </p>
                                <Link 
                                    to="/classrooms"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-ms-blue text-white font-bold rounded-xl border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
                                >
                                    View Your Classrooms
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Features Grid */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {features.map((feature, idx) => (
                        <Card key={idx} rotate={idx % 2 === 0 ? 1 : -1} className="h-full">
                            <feature.icon className="w-10 h-10 text-ms-blue mb-4" />
                            <h3 className="text-lg font-display font-black text-slate-900 dark:text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                {feature.desc}
                            </p>
                            <Link 
                                to={feature.link}
                                className="inline-flex items-center gap-1 text-ms-blue font-bold hover:underline"
                            >
                                {feature.action}
                                <ArrowRight size={14} />
                            </Link>
                        </Card>
                    ))}
                </motion.div>

            </div>
        </div>
    );
};

export default Insights;
