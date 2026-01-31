'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[var(--theme-primary)] text-[var(--theme-secondary)] hover:bg-[var(--theme-accent)] focus:ring-[var(--theme-primary)]',
        secondary: 'bg-[var(--theme-secondary)] text-[var(--theme-primary)] border border-[var(--theme-border)] hover:bg-[var(--theme-hover)] focus:ring-[var(--theme-primary)]',
        outline: 'bg-transparent text-[var(--theme-primary)] border-2 border-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-[var(--theme-secondary)] focus:ring-[var(--theme-primary)]',
        ghost: 'bg-transparent text-[var(--theme-primary)] hover:bg-[var(--theme-hover)] focus:ring-[var(--theme-primary)]',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm rounded-md',
        md: 'px-6 py-3 text-base rounded-lg',
        lg: 'px-8 py-4 text-lg rounded-xl',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
}
