import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Eye, EyeOff, ArrowRight, Mail, Lock, User, School } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import { authAPI, storage } from '../services/api';

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        school: '', 
        password: '', 
        agreeTerms: false 
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Check if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.agreeTerms) {
            setError('Please agree to the terms and conditions');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await authAPI.register(
                formData.name, 
                formData.email, 
                formData.password
            );
            
            if (response.success) {
                // Store auth data
                storage.setAuth(response.data.token, response.data.user);
                navigate('/dashboard');
            } else {
                setError(response.message || response.error || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container flex items-center justify-center min-h-screen py-8">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card rotate={1} className="p-8">
                        {/* Logo */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ms-violet/10 border-2 border-ms-violet/30 mb-4">
                                <Brain className="w-8 h-8 text-ms-violet" />
                            </div>
                            <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">
                                Create Account
                            </h1>
                            <p className="text-slate-500 mt-2">Start your free 14-day trial</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ms-violet focus:outline-none transition-colors font-medium"
                                        placeholder="John Smith"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ms-violet focus:outline-none transition-colors font-medium"
                                        placeholder="teacher@school.edu"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    School/Institution
                                </label>
                                <div className="relative">
                                    <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.school}
                                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ms-violet focus:outline-none transition-colors font-medium"
                                        placeholder="Lincoln High School"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ms-violet focus:outline-none transition-colors font-medium"
                                        placeholder="Min 8 characters"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
                                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                                </div>
                            )}

                            <label className="flex items-start gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={formData.agreeTerms}
                                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                                    className="w-5 h-5 mt-0.5 rounded border-2 border-slate-300 text-ms-violet focus:ring-ms-violet" 
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-ms-violet hover:underline font-bold">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" className="text-ms-violet hover:underline font-bold">Privacy Policy</Link>
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={isLoading || !formData.agreeTerms}
                                className="w-full py-4 bg-ms-violet text-white font-black text-lg rounded-xl border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Sign in link */}
                        <p className="text-center mt-6 text-slate-600 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-ms-violet hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
