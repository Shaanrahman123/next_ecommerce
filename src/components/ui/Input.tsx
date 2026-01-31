'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[var(--theme-text-primary)] mb-2">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
            w-full px-4 py-3 
            bg-[var(--theme-secondary)] 
            border border-[var(--theme-border)] 
            rounded-lg 
            text-[var(--theme-text-primary)]
            placeholder:text-[var(--theme-text-muted)]
            focus:outline-none 
            focus:ring-2 
            focus:ring-[var(--theme-primary)] 
            focus:border-transparent
            transition-all duration-300
            disabled:opacity-50 
            disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-[var(--theme-text-muted)]">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
