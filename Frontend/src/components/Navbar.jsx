import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Brain, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        
        if (localStorage.theme === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
            if (!localStorage.theme) localStorage.theme = 'light';
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        document.documentElement.classList.add('no-transitions');
        
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
        
        document.documentElement.offsetHeight;
        setTimeout(() => {
            document.documentElement.classList.remove('no-transitions');
        }, 100);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Classrooms', path: '/classrooms' },
        { name: 'Upload', path: '/upload' },
        { name: 'Insights', path: '/insights' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <nav className={`fixed top-4 left-0 right-0 z-50 transition-all duration-500 flex justify-center px-4`}>
            <div className={`
                relative flex items-center justify-between px-6 py-3 rounded-full 
                transition-all duration-500 w-full max-w-6xl
                ${scrolled 
                    ? 'bg-white/90 dark:bg-black/80 backdrop-blur-xl border-2 border-ms-blue/30 shadow-brutal-blue scale-95' 
                    : 'bg-white/50 dark:bg-black/40 backdrop-blur-md border border-white/10 shadow-brutal-blue hover:border-ms-blue/50'}
            `}>
                {/* Glow Animation */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-ms-blue/20 via-ms-violet/20 to-ms-neon/20 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Logo Section */}
                <NavLink to="/" className="flex items-center gap-3 group relative z-10">
                    <div className="relative w-12 h-12 flex items-center justify-center bg-ms-blue/10 rounded-full border-2 border-ms-blue/30 group-hover:rotate-6 transition-transform duration-500 overflow-hidden shadow-[0_0_20px_rgba(0,164,239,0.3)]">
                        <Brain className="w-7 h-7 text-ms-blue" />
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-ms-blue group-hover:to-ms-neon transition-all duration-300">
                        Teacher Copilot
                    </span>
                </NavLink>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-2 bg-black/5 dark:bg-white/5 p-1.5 rounded-full border border-black/5 dark:border-white/5 backdrop-blur-sm">
                    {navLinks.map((link) => (
                        <NavLink 
                            key={link.name} 
                            to={link.path}
                            className={({ isActive }) => `
                                relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 overflow-hidden group
                                ${isActive 
                                    ? 'text-white bg-ms-blue shadow-brutal-violet scale-105' 
                                    : 'text-gray-600 dark:text-ms-dim hover:text-ms-blue dark:hover:text-ms-neon hover:bg-white/10'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className="relative z-10">{link.name}</span>
                                    {!isActive && (
                                        <span className="absolute inset-0 bg-ms-blue/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="hidden lg:flex items-center gap-4 relative z-10">
                    <button 
                        onClick={toggleTheme}
                        className="p-2.5 rounded-full transition-all duration-300 border-2 bg-white dark:bg-slate-900 border-slate-900 dark:border-white shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] text-slate-900 dark:text-white"
                        aria-label="Toggle Theme"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <NavLink 
                        to="/login"
                        className={({ isActive }) => `
                            group relative px-6 py-2.5 rounded-full font-bold text-sm overflow-hidden transition-all duration-200 border-2
                            ${isActive 
                                ? 'bg-ms-violet text-white shadow-brutal' 
                                : 'bg-black dark:bg-white text-white dark:text-black shadow-brutal hover:shadow-[2px_2px_0px_#00A4EF] hover:translate-x-[2px] hover:translate-y-[2px] border-transparent hover:border-ms-blue'}
                        `}
                    >
                        <span className="relative z-10 group-hover:mr-2 transition-all">Login</span>
                        <span className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300">→</span>
                    </NavLink>
                </div>

                {/* Mobile Toggle */}
                <button 
                    className="lg:hidden p-2 text-gray-900 dark:text-white rounded-lg hover:bg-white/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`
                fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-300 lg:hidden
                ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `} onClick={() => setIsMobileMenuOpen(false)} />

            {/* Mobile Menu Content */}
            <div className={`
                absolute top-24 left-4 right-4 bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-white p-6 lg:hidden flex flex-col gap-6 shadow-brutal-lg dark:shadow-brutal-lg-dark z-50 transition-all duration-500 transform rotate-1 rounded-2xl
                ${isMobileMenuOpen ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-95 pointer-events-none'}
            `}>
                <div className="flex justify-between items-center pb-4 border-b-4 border-slate-900 dark:border-white">
                    <span className="text-xs font-black font-mono text-ms-blue uppercase tracking-tighter">AI_TEACHER v1.0</span>
                    <button 
                        onClick={toggleTheme}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ms-yellow text-black border-2 border-black dark:border-white shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff] text-[10px] font-black uppercase active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all z-20 flex-shrink-0"
                    >
                        {isDark ? <><Sun size={12} /> LIGHT</> : <><Moon size={12} /> DARK</>}
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    {navLinks.map((link, i) => (
                        <NavLink 
                            key={link.name} 
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `
                                text-xl font-black p-4 transition-all border-4 border-slate-900 dark:border-white rounded-full
                                ${isActive 
                                    ? 'bg-ms-blue text-white shadow-[4px_4px_2px_#7F00FF] -rotate-1 translate-x-1' 
                                    : `bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-ms-blue/10 ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 hover:translate-x-1 hover:shadow-[4px_4px_2px_#00A4EF] shadow-none`}
                            `}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                <NavLink 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-4 bg-ms-neon text-slate-900 font-black text-center text-xl tracking-tighter border-4 border-slate-900 shadow-[6px_6px_2px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95 uppercase rounded-full"
                >
                    LOGIN
                </NavLink>
            </div>
        </nav>
    );
};

export default Navbar;
