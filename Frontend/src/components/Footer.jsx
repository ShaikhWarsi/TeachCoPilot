import React from 'react';
import { Github, Twitter, Linkedin, Heart, Mail, ArrowUpRight, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState('idle');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || status === 'loading') return;
        setStatus('loading');
        setTimeout(() => {
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000);
        }, 1000);
    };

    const productLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Upload', path: '/upload' },
        { name: 'Insights', path: '/insights' },
        { name: 'Pricing', path: '/pricing' }
    ];

    const resourceLinks = [
        { name: 'Documentation', path: '/docs' },
        { name: 'API Reference', path: '/api' },
        { name: 'Tutorials', path: '/tutorials' },
        { name: 'Blog', path: '/blog' }
    ];

    const socialLinks = [
        { icon: Twitter, href: "#", color: "hover:bg-ms-blue hover:text-white" },
        { icon: Linkedin, href: "#", color: "hover:bg-ms-blue hover:text-white" },
        { icon: Github, href: "#", color: "hover:bg-ms-violet hover:text-white" }
    ];

    return (
        <footer className="relative bg-white dark:bg-[#0B1221] text-slate-900 dark:text-white pt-24 pb-12 overflow-hidden mt-20 transition-colors duration-500 rounded-t-[3rem] md:rounded-t-[5rem]">
            {/* Background Text */}
            <div className="absolute top-20 left-0 w-full opacity-5 pointer-events-none select-none">
                <h1 className="text-[20vw] leading-[0.8] font-black font-display whitespace-nowrap text-slate-900 dark:text-white">
                    TEACHER COPILOT
                </h1>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-12 mb-20">
                    {/* Brand Card */}
                    <div className="bg-ms-blue text-white p-8 rounded-[2rem] border-4 border-slate-900 dark:border-white shadow-brutal-lg dark:shadow-brutal-lg-dark -rotate-2 hover:rotate-0 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none dark:hover:shadow-none transition-all duration-300 max-w-md cursor-pointer text-center md:text-left">
                        <Link to="/" className="flex items-center gap-3 mb-4">
                            <Brain className="w-10 h-10" />
                            <span className="text-3xl font-black font-display tracking-tighter">
                                Teacher Copilot
                            </span>
                        </Link>
                        <p className="text-lg font-medium opacity-90 leading-relaxed">
                            AI-powered feedback engine that helps teachers grade faster and smarter.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap gap-4 justify-center md:justify-end max-w-lg">
                        <Link to="/about" className="px-6 py-3 rounded-full border-2 border-slate-900 dark:border-white font-bold bg-ms-orange text-white shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:scale-[1.02] transition-all duration-200">About</Link>
                        <Link to="/contact" className="px-6 py-3 rounded-full bg-ms-green text-white font-bold border-2 border-slate-900 dark:border-white shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:scale-[1.02] transition-all duration-200 rotate-2">Contact</Link>
                        <Link to="/dashboard" className="px-6 py-3 rounded-full border-2 border-slate-900 dark:border-white font-bold bg-ms-blue text-white shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:scale-[1.05] transition-all duration-200 hover:-rotate-3">Dashboard</Link>
                        <Link to="/upload" className="px-8 py-3 rounded-full bg-ms-yellow font-bold text-lg border-2 border-slate-900 dark:border-white shadow-brutal text-slate-900 dark:text-black hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:scale-[1.02] transition-all duration-200 -rotate-2">Upload</Link>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div>
                        <h3 className="font-black text-lg mb-4 text-ms-blue">Product</h3>
                        <ul className="space-y-2">
                            {productLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-slate-600 dark:text-slate-400 hover:text-ms-blue dark:hover:text-ms-neon transition-colors font-medium">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-black text-lg mb-4 text-ms-violet">Resources</h3>
                        <ul className="space-y-2">
                            {resourceLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-slate-600 dark:text-slate-400 hover:text-ms-violet dark:hover:text-ms-neon transition-colors font-medium">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-black text-lg mb-4 text-ms-green">Stay Updated</h3>
                        <form onSubmit={handleSubmit} className="relative group">
                            <div className="absolute inset-0 bg-ms-violet rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative flex items-center bg-white dark:bg-black border-2 border-slate-900 dark:border-white rounded-full p-2 pl-6 shadow-brutal rotate-1 focus-within:-rotate-1 transition-transform">
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={status === 'success' ? "Subscribed! 🎉" : "Get updates"}
                                    disabled={status === 'loading' || status === 'success'}
                                    className="bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none w-full font-bold disabled:opacity-70"
                                />
                                <button 
                                    type="submit"
                                    disabled={status === 'loading' || status === 'success'}
                                    className="bg-ms-yellow text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-ms-blue hover:text-white transition-all border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:bg-slate-400"
                                >
                                    {status === 'loading' ? (
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Mail size={20} />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-t-2 border-slate-900/10 dark:border-white/10 pt-8">
                    {/* Social Icons */}
                    <div className="flex gap-4">
                        {socialLinks.map((Social, index) => (
                            <a 
                                key={index}
                                href={Social.href} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-12 h-12 rounded-full border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${Social.color} transition-all duration-200`}
                            >
                                <Social.icon size={20} />
                            </a>
                        ))}
                    </div>

                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                        Made with 
                        <Heart size={14} className="text-ms-neon fill-ms-neon animate-pulse" />
                        by 
                        <span className="font-display font-black text-base tracking-tighter ml-1">
                            <span className="text-ms-blue">TEACHER</span>
                            <span className="text-ms-orange ml-1">COPILOT</span>
                        </span>
                    </p>

                    <p className="text-xs text-slate-500 font-medium">
                        © 2025 Teacher Copilot. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
