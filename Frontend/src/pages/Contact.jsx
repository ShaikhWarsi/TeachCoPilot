import React, { useState } from 'react';
import { 
    Mail, Phone, MapPin, Send, CheckCircle, Twitter, 
    Linkedin, Github, MessageSquare, HelpCircle, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    const contactMethods = [
        {
            icon: Mail,
            title: "Email Us",
            desc: "Get a response within 24 hours",
            value: "hello@teachercopilot.ai",
            color: "bg-ms-blue"
        },
        {
            icon: Phone,
            title: "Call Us",
            desc: "Mon-Fri, 9am-6pm EST",
            value: "+1 (555) 123-4567",
            color: "bg-ms-green"
        },
        {
            icon: MapPin,
            title: "Visit Us",
            desc: "San Francisco, CA",
            value: "123 AI Street, Tech Hub",
            color: "bg-ms-violet"
        }
    ];

    const socialLinks = [
        { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-ms-blue" },
        { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-ms-blue" },
        { icon: Github, href: "#", label: "GitHub", color: "hover:bg-ms-violet" },
    ];

    const faqs = [
        {
            question: "How does the AI grading work?",
            answer: "Our AI uses advanced natural language processing to understand student answers, compare them against rubrics, and provide detailed feedback with suggested scores."
        },
        {
            question: "Is my student data secure?",
            answer: "Absolutely. We use bank-level encryption, never sell data, and comply with FERPA. Files are automatically deleted after 30 days."
        },
        {
            question: "Can I customize the grading rubric?",
            answer: "Yes! You can define custom criteria, point values, and even specific feedback templates for different types of assignments."
        },
        {
            question: "What file formats are supported?",
            answer: "We support PDF, DOCX, PNG, and JPG files. Each file can be up to 10MB in size."
        }
    ];

    return (
        <div className="page-container">
            <div className="page-content max-w-6xl">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-4">
                        Get In <span className="text-gradient">Touch</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </motion.div>

                {/* Contact Methods */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                >
                    {contactMethods.map((method, idx) => (
                        <Card key={idx} rotate={idx === 1 ? 1 : -1} className="text-center">
                            <div className={`w-14 h-14 mx-auto rounded-2xl ${method.color} flex items-center justify-center mb-4`}>
                                <method.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{method.title}</h3>
                            <p className="text-sm text-slate-500 mb-2">{method.desc}</p>
                            <p className="font-bold text-ms-blue">{method.value}</p>
                        </Card>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <Card rotate={0} className="h-full">
                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-ms-green/20 flex items-center justify-center">
                                        <CheckCircle className="w-10 h-10 text-ms-green" />
                                    </div>
                                    <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
                                        Message Sent!
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                                        Thanks for reaching out. We'll get back to you within 24 hours.
                                    </p>
                                    <button 
                                        onClick={() => setIsSubmitted(false)}
                                        className="px-6 py-3 bg-ms-blue text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                        <MessageSquare className="text-ms-blue" />
                                        Send a Message
                                    </h3>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                    Your Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ms-blue focus:outline-none transition-colors font-medium"
                                                    placeholder="John Smith"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ms-blue focus:outline-none transition-colors font-medium"
                                                    placeholder="john@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                Subject *
                                            </label>
                                            <select
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ms-blue focus:outline-none transition-colors font-medium"
                                                required
                                            >
                                                <option value="">Select a topic</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="support">Technical Support</option>
                                                <option value="sales">Sales / Enterprise</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="feedback">Feedback</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                Message *
                                            </label>
                                            <textarea
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                rows={5}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ms-blue focus:outline-none transition-colors font-medium resize-none"
                                                placeholder="Tell us how we can help..."
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-ms-blue text-white font-black text-lg rounded-xl border-4 border-slate-900 dark:border-white shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send size={20} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </Card>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Social Links */}
                        <Card rotate={1}>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                Follow Us
                            </h3>
                            <div className="flex gap-3">
                                {socialLinks.map((social, idx) => (
                                    <a
                                        key={idx}
                                        href={social.href}
                                        className={`w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 ${social.color} hover:text-white hover:border-transparent transition-all`}
                                        aria-label={social.label}
                                    >
                                        <social.icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </Card>

                        {/* FAQ Preview */}
                        <Card rotate={-1}>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <HelpCircle className="text-ms-violet" />
                                Quick Help
                            </h3>
                            <div className="space-y-3">
                                {faqs.slice(0, 3).map((faq, idx) => (
                                    <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                                            {faq.question}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-4 w-full py-3 text-ms-blue font-bold hover:underline flex items-center justify-center gap-1">
                                View All FAQs
                                <ArrowRight size={16} />
                            </button>
                        </Card>

                        {/* Support Hours */}
                        <Card rotate={0} variant="colored" className="!p-6">
                            <h3 className="text-lg font-bold text-white mb-2">
                                Support Hours
                            </h3>
                            <div className="space-y-1 text-white/80 text-sm">
                                <p>Monday - Friday: 9AM - 6PM EST</p>
                                <p>Saturday: 10AM - 4PM EST</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Map Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12"
                >
                    <Card rotate={0} className="overflow-hidden !p-0">
                        <div className="h-64 bg-gradient-to-br from-ms-blue/20 to-ms-violet/20 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-12 h-12 text-ms-blue mx-auto mb-2" />
                                <p className="font-bold text-slate-900 dark:text-white">San Francisco, CA</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">123 AI Street, Tech Hub</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
