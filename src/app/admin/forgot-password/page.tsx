'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function AdminForgotPasswordPage() {
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
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
                <div className="max-w-md w-full">
                    <div className="bg-white border border-gray-300 rounded-lg p-8 text-center animate-scale-in">
                        <div className="w-16 h-16 bg-black rounded-md flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
                            Link Sent
                        </h2>
                        <p className="text-sm font-medium text-gray-500 mb-2">
                            Recovery instructions have been sent to
                        </p>
                        <p className="text-base font-semibold text-black mb-8">
                            {email}
                        </p>
                        <Button
                            onClick={() => router.push('/admin/login')}
                            fullWidth
                            className="h-12 bg-black text-white rounded-md font-semibold text-base hover:bg-gray-900 transition-all shadow-none"
                        >
                            Return to Login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-6 h-0.5 bg-black rounded-full" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Recovery</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Reset Password
                    </h1>
                    <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto">
                        Authorized email required for password recovery
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-12 space-y-8">
                    <div className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="admin@example.com"
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
                        className="h-14 bg-black text-white rounded-md font-semibold text-base hover:bg-gray-900 transition-all shadow-none"
                    >
                        Send Recovery Link
                    </Button>

                    <div className="text-center pt-4">
                        <Link
                            href="/admin/login"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
