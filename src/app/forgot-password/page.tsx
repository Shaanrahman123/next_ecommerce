'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validateEmail = () => {
        if (!email) {
            setError('Email is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail()) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);

            // Redirect to OTP verification after 2 seconds
            setTimeout(() => {
                router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
            }, 2000);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 text-center animate-scale-in">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--theme-primary)] mb-3">
                            Check Your Email
                        </h2>
                        <p className="text-xs text-[var(--theme-text-secondary)] mb-6">
                            We've sent a 6-digit verification code to
                        </p>
                        <p className="text-xs text-[var(--theme-primary)] font-semibold mb-6">
                            {email}
                        </p>
                        <div className="w-12 h-1 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-accent)] mx-auto rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-accent)] rounded-2xl mb-6 shadow-lg">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--theme-primary)] mb-2 uppercase tracking-wide">
                        Forgot Password?
                    </h1>
                    <p className="text-xs text-[var(--theme-text-secondary)] max-w-sm mx-auto">
                        No worries! Enter your email address and we'll send you a code to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="relative">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError('');
                            }}
                            error={error}
                            required
                            className="pl-12"
                        />
                        <Mail className="absolute left-4 top-[42px] w-5 h-5 text-[var(--theme-text-muted)]" />
                    </div>

                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Send Verification Code
                    </Button>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm text-[var(--theme-primary)] hover:text-[var(--theme-accent)] font-medium transition-colors duration-300"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </form>

                <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-[var(--theme-text-secondary)] text-center">
                        <span className="font-semibold text-[var(--theme-primary)]">Tip:</span> Check your spam folder if you don't receive the email within a few minutes.
                    </p>
                </div>
            </div>
        </div>
    );
}
