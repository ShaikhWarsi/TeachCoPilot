import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowRight, Sparkles, FileText, BarChart3, Brain, 
    Zap, CheckCircle, ChevronDown, Star, Quote 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';

const Landing = () => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    const features = [
        { 
            icon: FileText, 
            title: "Easy Upload", 
            desc: "Drag & drop PDF, DOCX, or images. We handle the rest.", 
            rotate: 1, 
            color: "bg-ms-blue" 
        },
        { 
            icon: Brain, 
            title: "AI Grading", 
            desc: "Intelligent evaluation with detailed feedback instantly.", 
            rotate: -1, 
            color: "bg-ms-violet" 
        },
        { 
            icon: BarChart3, 
            title: "Class Insights", 
            desc: "Visualize performance trends and identify learning gaps.", 
            rotate: 2, 
            color: "bg-ms-green" 
        },
        { 
            icon: Zap, 
            title: "Save Hours", 
            desc: "Reduce grading time by 80%. Focus on teaching, not paperwork.", 
            rotate: -2, 
            color: "bg-ms-neon" 
        }
    ];

    const steps = [
        { number: "01", title: "Upload Files", desc: "Upload student assignments in any format" },
        { number: "02", title: "AI Extraction", desc: "Our AI extracts and understands the content" },
        { number: "03", title: "Smart Evaluation", desc: "Get detailed scores and personalized feedback" },
        { number: "04", title: "Review & Share", desc: "Review AI feedback and share with students" }
    ];

    const testimonials = [
        { name: "Sarah Johnson", role: "High School Math Teacher", text: "Teacher Copilot saved me 10+ hours every week. The AI feedback is surprisingly accurate!" },
        { name: "Michael Chen", role: "University Professor", text: "Finally, a tool that understands context. The insights help me improve my lectures." },
        { name: "Emily Rodriguez", role: "Elementary Teacher", text: "My students love the detailed feedback. It's like having a teaching assistant 24/7." }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 px-4">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-ms-blue/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-ms-violet/20 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ms-neon/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
                    {/* Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={isReady ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ms-blue/10 border-2 border-ms-blue/30"
                    >
                        <Sparkles size={16} className="text-ms-blue" />
                        <span className="text-sm font-bold text-ms-blue">AI-Powered for Modern Educators</span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={isReady ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] leading-[0.9] font-display font-black tracking-tighter text-slate-900 dark:text-white mb-6"
                    >
                        <span className="text-gradient">AI Feedback</span>
                        <br />
                        <span>Engine for Teachers</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={isReady ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mb-10 font-medium"
                    >
                        Upload assignments and get instant AI-powered evaluation, 
                        feedback, and class insights.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={isReady ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 mb-16"
                    >
                        <Link 
                            to="/signup"
                            className="group px-8 py-4 bg-ms-blue text-white font-black text-lg rounded-full border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-150 flex items-center justify-center gap-2"
                        >
                            Get Started Free
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>
                        <Link 
                            to="/dashboard"
                            className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-lg rounded-full border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-150 flex items-center justify-center"
                        >
                            See Demo
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={isReady ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="flex flex-wrap justify-center gap-8 md:gap-16"
                    >
                        {[
                            { value: "50K+", label: "Assignments Graded" },
                            { value: "10K+", label: "Teachers" },
                            { value: "80%", label: "Time Saved" }
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-3xl md:text-4xl font-black text-ms-blue">{stat.value}</div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={isReady ? { opacity: 1 } : {}}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <ChevronDown className="w-8 h-8 text-slate-400 animate-bounce" />
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-4">
                            Powerful <span className="text-gradient">Features</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Everything you need to grade smarter, not harder
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <Card key={idx} rotate={feature.rotate} className="group h-full">
                                <div className={`absolute top-0 right-0 w-20 h-20 ${feature.color} opacity-20 rounded-bl-[2rem] transition-all duration-300 group-hover:scale-[8] group-hover:opacity-10`} />
                                <feature.icon size={40} className="mb-4 text-slate-900 dark:text-white relative z-10" />
                                <h3 className="text-xl font-black font-display text-slate-900 dark:text-white mb-2 relative z-10">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium relative z-10">{feature.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-4 bg-ms-blue/5 dark:bg-ms-blue/10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-4">
                            How It <span className="text-gradient">Works</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Four simple steps to transform your grading workflow
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, idx) => (
                            <div key={idx} className={`relative ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform duration-300`}>
                                <Card className="h-full text-center" hover={false}>
                                    <div className="text-5xl font-black text-ms-blue/20 mb-4">{step.number}</div>
                                    <h3 className="text-xl font-black font-display text-slate-900 dark:text-white mb-2">{step.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{step.desc}</p>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Preview */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-4">
                            See It In <span className="text-gradient">Action</span>
                        </h2>
                    </div>

                    <Card rotate={0} className="overflow-hidden">
                        <div className="bg-slate-100 dark:bg-slate-800 p-6 md:p-8">
                            {/* Mock Dashboard */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-ms-blue/20 flex items-center justify-center">
                                            <Brain className="w-5 h-5 text-ms-blue" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">Assignment #42</div>
                                            <div className="text-xs text-slate-500">Mathematics - Grade 10</div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-ms-green/20 text-ms-green text-sm font-bold">Graded</div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                                        <div className="text-xs text-slate-500 uppercase mb-1">Score</div>
                                        <div className="text-2xl font-black text-ms-blue">87/100</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                                        <div className="text-xs text-slate-500 uppercase mb-1">Accuracy</div>
                                        <div className="text-2xl font-black text-ms-green">92%</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                                        <div className="text-xs text-slate-500 uppercase mb-1">Time Saved</div>
                                        <div className="text-2xl font-black text-ms-violet">15 min</div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-ms-blue/5 border border-ms-blue/20">
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="w-5 h-5 text-ms-blue flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white mb-1">AI Feedback</div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Strong understanding of quadratic equations. Consider reviewing factoring techniques 
                                                for more complex polynomials. Excellent work on word problems!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-4 bg-ms-violet/5 dark:bg-ms-violet/10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-4">
                            Teachers <span className="text-gradient">Love Us</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, idx) => (
                            <Card key={idx} rotate={idx === 1 ? 1 : idx === 2 ? -1 : 0} className="relative">
                                <Quote className="w-10 h-10 text-ms-blue/20 absolute top-4 right-4" />
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className="fill-ms-yellow text-ms-yellow" />
                                    ))}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 mb-6 font-medium leading-relaxed">
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ms-blue to-ms-violet flex items-center justify-center text-white font-bold text-lg">
                                        {testimonial.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white">{testimonial.name}</div>
                                        <div className="text-sm text-slate-500">{testimonial.role}</div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <Card rotate={0} variant="colored" className="text-center py-16 px-8">
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
                            Ready to Transform Your Grading?
                        </h2>
                        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                            Join thousands of teachers saving hours every week with AI-powered feedback
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                to="/signup"
                                className="px-8 py-4 bg-white text-ms-blue font-black text-lg rounded-full border-4 border-slate-900 shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-150 flex items-center justify-center gap-2"
                            >
                                Start Free Trial
                                <CheckCircle size={20} />
                            </Link>
                            <Link 
                                to="/contact"
                                className="px-8 py-4 bg-transparent text-white font-black text-lg rounded-full border-4 border-white hover:bg-white/10 transition-all duration-150 flex items-center justify-center"
                            >
                                Talk to Sales
                            </Link>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default Landing;
