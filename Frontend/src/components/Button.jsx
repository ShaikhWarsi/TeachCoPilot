import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ 
    children, 
    to, 
    onClick, 
    variant = 'primary', 
    size = 'md', 
    className = '',
    icon: Icon,
    rotate = 0,
    ...props 
}) => {
    const baseStyles = 'font-black rounded-full border-4 border-slate-900 dark:border-white transition-all duration-150 flex items-center justify-center gap-2';
    
    const variants = {
        primary: 'bg-ms-blue text-white shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:scale-95',
        secondary: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:scale-95',
        accent: 'bg-ms-violet text-white shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:scale-95',
        neon: 'bg-ms-neon text-slate-900 shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:scale-95',
        ghost: 'bg-transparent text-slate-900 dark:text-white border-2 hover:bg-white/10 dark:hover:bg-white/5'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        xl: 'px-10 py-5 text-xl'
    };

    const rotation = rotate !== 0 ? `rotate-[${rotate}deg] hover:rotate-0` : '';

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${rotation} ${className}`;

    if (to) {
        return (
            <Link to={to} className={combinedClassName} {...props}>
                {children}
                {Icon && <Icon size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} className="group-hover:translate-x-1 transition-transform" />}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={combinedClassName} {...props}>
            {children}
            {Icon && <Icon size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} className="group-hover:translate-x-1 transition-transform" />}
        </button>
    );
};

export default Button;
