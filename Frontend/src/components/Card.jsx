import React from 'react';

const Card = ({ 
    children, 
    className = '', 
    rotate = 0,
    hover = true,
    padding = 'normal',
    variant = 'default'
}) => {
    const rotations = {
        '-2': '-rotate-2',
        '-1': '-rotate-1',
        0: 'rotate-0',
        1: 'rotate-1',
        2: 'rotate-2',
        3: 'rotate-3'
    };

    const paddings = {
        none: '',
        small: 'p-4',
        normal: 'p-6',
        large: 'p-8'
    };

    const variants = {
        default: 'bg-white dark:bg-slate-900',
        glass: 'glass-panel',
        colored: 'bg-ms-blue text-white',
        dark: 'bg-slate-900 text-white'
    };

    const baseStyles = `
        rounded-[2rem] border-4 border-slate-900 dark:border-white 
        shadow-brutal-lg dark:shadow-brutal-lg-dark 
        ${hover ? 'hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none dark:hover:shadow-none hover:rotate-0' : ''}
        transition-all duration-200
    `;

    const combinedClassName = `${baseStyles} ${variants[variant]} ${paddings[padding]} ${rotations[rotate] || ''} ${className}`;

    return (
        <div className={combinedClassName}>
            {children}
        </div>
    );
};

export default Card;
