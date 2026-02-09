'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Lock, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Password strength criteria
    const passwordCriteria = [
        { label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
        { label: 'Contains uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
        { label: 'Contains lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
        { label: 'Contains number', test: (pwd: string) => /\d/.test(pwd) },
        { label: 'Contains special character', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
    ];

    const getPasswordStrength = (password: string) => {
        const passedCriteria = passwordCriteria.filter(c => c.test(password)).length;
        if (passedCriteria <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
        if (passedCriteria <= 3) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
        return { label: 'Strong', color: 'bg-green-500', width: '100%' };
    };

    const validateForm = () => {
        const newErrors: { password?: string; confirmPassword?: string } = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!passwordCriteria.every(c => c.test(formData.password))) {
            newErrors.password = 'Password does not meet all requirements';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full">
                    <div className="bg-white border border-gray-300 rounded-lg p-8 text-center animate-scale-in">
                        <div className="w-16 h-16 bg-black rounded-md flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
                            Success
                        </h2>
                        <p className="text-sm font-medium text-gray-500 mb-8">
                            Your password has been reset. Redirecting to login...
                        </p>
                        <div className="w-12 h-0.5 bg-black mx-auto rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    const strength = formData.password ? getPasswordStrength(formData.password) : null;

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-6 h-0.5 bg-black rounded-full" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Security Update</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Reset Password
                    </h1>
                    <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto">
                        Create a strong password for your account
                    </p>
                    {email && (
                        <p className="text-sm font-semibold text-black mt-2">
                            for {email}
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="mt-12 space-y-8">
                    <div className="space-y-6">
                        <div className="relative">
                            <Input
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value });
                                    if (errors.password) setErrors({ ...errors, password: undefined });
                                }}
                                error={errors.password}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[38px] text-gray-400 hover:text-black transition-colors duration-300"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {formData.password && (
                            <div className="space-y-4 pt-2 animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-600">Strength:</span>
                                    <span className={`text-xs font-semibold ${strength?.label === 'Weak' ? 'text-red-500' :
                                        strength?.label === 'Medium' ? 'text-yellow-600' :
                                            'text-green-600'
                                        }`}>
                                        {strength?.label}
                                    </span>
                                </div>
                                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${strength?.label === 'Weak' ? 'bg-red-500' : strength?.label === 'Medium' ? 'bg-yellow-500' : 'bg-black'} transition-all duration-500 ease-out`}
                                        style={{ width: strength?.width }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-2 pt-2">
                                    {passwordCriteria.map((criterion, index) => {
                                        const isPassed = criterion.test(formData.password);
                                        return (
                                            <div
                                                key={index}
                                                className={`flex items-center gap-2 text-xs font-medium transition-all duration-300 ${isPassed ? 'text-black' : 'text-gray-400'
                                                    }`}
                                            >
                                                {isPassed ? (
                                                    <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                                                ) : (
                                                    <X className="w-3 h-3 flex-shrink-0" />
                                                )}
                                                <span>{criterion.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <Input
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => {
                                    setFormData({ ...formData, confirmPassword: e.target.value });
                                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                                }}
                                error={errors.confirmPassword}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-[38px] text-gray-400 hover:text-black transition-colors duration-300"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        className="h-14 bg-black text-white rounded-md font-semibold text-base hover:bg-gray-900 transition-all shadow-none"
                    >
                        Reset Password
                    </Button>
                </form>

                <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-600 text-center leading-relaxed">
                        <span className="text-black font-semibold">Remember:</span> Use a unique password that you don't use for other accounts.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
