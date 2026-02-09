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
            <div className={`w-full ${className}`}>
                {label && (
                    <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
                        w-full px-4 py-3 
                        bg-white
                        border border-gray-300
                        rounded-md
                        text-base font-normal text-gray-900
                        placeholder:text-gray-400
                        focus:outline-none 
                        focus:border-black
                        transition-all duration-300
                        disabled:opacity-50 
                        disabled:cursor-not-allowed
                        ${error ? 'border-red-500 focus:border-red-500' : ''}
                    `}
                    {...props}
                />
                {(error || helperText) && (
                    <p className={`mt-1.5 text-xs font-medium ${error ? 'text-red-500' : 'text-gray-500'}`}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
