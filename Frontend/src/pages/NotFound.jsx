import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowLeft, Home, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';

const NotFound = () => {
    return (
        <div className="page-container flex items-center justify-center min-h-screen">
            <div className="w-full max-w-2xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* 404 Animation */}
                    <div className="relative mb-8">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-[150px] md:text-[200px] font-black font-display leading-none text-gradient select-none"
                        >
                            404
                        </motion.div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
                            <Brain className="w-32 h-32 mx-auto" />
                        </div>
                    </div>

                    <Card rotate={0} className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white mb-4">
                            Page Not Found
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                            Oops! Looks like the AI couldn't find this page. It might have been moved, deleted, or never existed.
                        </p>

                        {/* Search Suggestion */}
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <div className="relative max-w-xs w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search for pages..."
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ms-blue focus:outline-none transition-colors font-medium"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                to="/"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ms-blue text-white font-black text-lg rounded-full border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
                            >
                                <Home size={20} />
                                Go Home
                            </Link>
                            <button 
                                onClick={() => window.history.back()}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-lg rounded-full border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
                            >
                                <ArrowLeft size={20} />
                                Go Back
                            </button>
                        </div>
                    </Card>

                    {/* Helpful Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'Dashboard', path: '/dashboard' },
                            { name: 'Upload', path: '/upload' },
                            { name: 'Insights', path: '/insights' },
                            { name: 'Contact', path: '/contact' }
                        ].map((link, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                            >
                                <Link 
                                    to={link.path}
                                    className="block p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-ms-blue transition-colors font-bold text-slate-700 dark:text-slate-300 hover:text-ms-blue"
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Fun Fact */}
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-12 text-sm text-slate-500"
                    >
                        Error Code: TEACHER_NOT_FOUND | Try asking the AI for help! 🤖
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
