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
                    {/* Topic Difficulty */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card rotate={0} className="h-full">
                            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <BarChart3 className="text-ms-blue" />
                                Topic Mastery Levels
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topicDifficultyData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis type="number" domain={[0, 100]} />
                                        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#1e293b', 
                                                border: 'none', 
                                                borderRadius: '12px',
                                                color: '#fff'
                                            }} 
                                        />
                                        <Bar dataKey="score" fill="#00A4EF" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Mistake Types */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card rotate={0} className="h-full">
                            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Target className="text-ms-violet" />
                                Error Distribution
                            </h3>
                            <div className="h-64 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={mistakeTypeData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {mistakeTypeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Performance Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                >
                    <Card rotate={0}>
                        <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="text-ms-green" />
                            Class Performance Trend
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={performanceTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="week" />
                                    <YAxis domain={[70, 90]} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#1e293b', 
                                            border: 'none', 
                                            borderRadius: '12px',
                                            color: '#fff'
                                        }} 
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="class" 
                                        stroke="#00A4EF" 
                                        strokeWidth={3}
                                        dot={{ fill: '#00A4EF' }}
                                        name="Class Average"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="target" 
                                        stroke="#7fba00" 
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        name="Target Score"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Struggling Students */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2"
                    >
                        <Card rotate={-1}>
                            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Users className="text-ms-orange" />
                                Students Requiring Attention
                            </h3>
                            <div className="space-y-3">
                                {strugglingStudents.map((student, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-ms-orange/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ms-orange to-red-500 flex items-center justify-center text-white font-bold">
                                                {student.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                                                <div className="text-sm text-slate-500">Struggling with: {student.topic}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">{student.attempts} attempts</div>
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                                student.trend === 'improving' ? 'bg-green-100 text-green-600' :
                                                student.trend === 'declining' ? 'bg-red-100 text-red-600' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                                {student.trend}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* AI Recommendations */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="space-y-4">
                            {recommendations.map((rec, idx) => (
                                <Card key={idx} rotate={idx % 2 === 0 ? 1 : -1} className="!p-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                            <rec.icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rec.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1">{rec.desc}</p>
                                            <button className="mt-2 text-xs font-bold text-ms-blue hover:underline">
                                                {rec.action} →
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 text-center"
                >
                    <Link 
                        to="/upload"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-ms-blue text-white font-black text-lg rounded-full border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
                    >
                        <Calendar size={20} />
                        Schedule Follow-up Assessment
                        <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Insights;
