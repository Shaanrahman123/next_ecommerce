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
                    <div className="bg-white rounded-2xl shadow-2xl p-8 text-center animate-scale-in">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--theme-primary)] mb-3">
                            Password Reset Successful!
                        </h2>
                        <p className="text-[var(--theme-text-secondary)] mb-6">
                            Your password has been successfully reset. You can now log in with your new password.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-[var(--theme-text-muted)]">
                            <div className="w-6 h-6 border-2 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin" />
                            <span>Redirecting to login...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const strength = formData.password ? getPasswordStrength(formData.password) : null;

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-lg animate-scale-in">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-[var(--theme-primary)] mb-2">
                        Reset Password
                    </h1>
                    <p className="text-[var(--theme-text-secondary)] max-w-sm mx-auto">
                        Create a strong password to secure your account
                    </p>
                    {email && (
                        <p className="text-sm text-[var(--theme-text-muted)] mt-2">
                            for <span className="font-semibold text-[var(--theme-primary)]">{email}</span>
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-5">
                        {/* New Password */}
                        <div className="relative">
                            <Input
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your new password"
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value });
                                    if (errors.password) setErrors({ ...errors, password: undefined });
                                }}
                                error={errors.password}
                                required
                                className="pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[42px] text-[var(--theme-text-muted)] hover:text-[var(--theme-primary)] transition-colors duration-300"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="space-y-3 animate-fade-in">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[var(--theme-text-secondary)]">Password Strength:</span>
                                    <span className={`font-semibold ${strength?.label === 'Weak' ? 'text-red-500' :
                                            strength?.label === 'Medium' ? 'text-yellow-500' :
                                                'text-green-500'
                                        }`}>
                                        {strength?.label}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${strength?.color} transition-all duration-500 ease-out`}
                                        style={{ width: strength?.width }}
                                    />
                                </div>

                                {/* Password Requirements */}
                                <div className="space-y-2 pt-2">
                                    {passwordCriteria.map((criterion, index) => {
                                        const isPassed = criterion.test(formData.password);
                                        return (
                                            <div
                                                key={index}
                                                className={`flex items-center gap-2 text-sm transition-all duration-300 ${isPassed ? 'text-green-600' : 'text-[var(--theme-text-muted)]'
                                                    }`}
                                            >
                                                {isPassed ? (
                                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                                ) : (
                                                    <X className="w-4 h-4 flex-shrink-0" />
                                                )}
                                                <span>{criterion.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Confirm Password */}
                        <div className="relative">
                            <Input
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Re-enter your new password"
                                value={formData.confirmPassword}
                                onChange={(e) => {
                                    setFormData({ ...formData, confirmPassword: e.target.value });
                                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                                }}
                                error={errors.confirmPassword}
                                required
                                className="pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-[42px] text-[var(--theme-text-muted)] hover:text-[var(--theme-primary)] transition-colors duration-300"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Match Indicator */}
                        {formData.confirmPassword && (
                            <div className={`flex items-center gap-2 text-sm animate-fade-in ${formData.password === formData.confirmPassword
                                    ? 'text-green-600'
                                    : 'text-red-500'
                                }`}>
                                {formData.password === formData.confirmPassword ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Passwords match</span>
                                    </>
                                ) : (
                                    <>
                                        <X className="w-4 h-4" />
                                        <span>Passwords do not match</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Reset Password
                    </Button>
                </form>

                <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <p className="text-sm text-[var(--theme-text-secondary)] text-center">
                        <span className="font-semibold text-[var(--theme-primary)]">Remember:</span> Use a unique password that you don't use for other accounts.
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
