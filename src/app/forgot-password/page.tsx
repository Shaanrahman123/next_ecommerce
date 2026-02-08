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
                    <div className="bg-white border border-gray-300 rounded-lg p-8 text-center animate-scale-in">
                        <div className="w-16 h-16 bg-black rounded-md flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-section-title font-black text-gray-900 uppercase tracking-tight mb-3">
                            Check Your Email
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                            We've sent a 6-digit verification code to
                        </p>
                        <p className="text-[12px] font-black text-black uppercase tracking-tight mb-8">
                            {email}
                        </p>
                        <div className="w-12 h-0.5 bg-black mx-auto rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-6 h-0.5 bg-black rounded-full" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Recovery</span>
                    </div>
                    <h1 className="text-section-title font-black text-gray-900 uppercase tracking-tight">
                        Forgot Password?
                    </h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-sm mx-auto">
                        Enter your email address to receive a recovery code
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-12 space-y-8">
                    <div className="space-y-6">
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
                        />
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        className="h-14 bg-black text-white rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 transition-all shadow-none"
                    >
                        Send Verification Code
                    </Button>

                    <div className="text-center pt-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-[10px] font-black text-black hover:underline uppercase tracking-widest"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </form>

                <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center leading-relaxed">
                        <span className="text-black font-black">Tip:</span> Check your spam folder if you don't receive the email within a few minutes.
                    </p>
                </div>
            </div>
        </div>
    );
}
