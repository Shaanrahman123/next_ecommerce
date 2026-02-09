'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
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
            // Mock login - in production, this would be an API call
            login({
                id: '1',
                email: formData.email,
                name: formData.email.split('@')[0],
                createdAt: new Date(),
            });

            setIsLoading(false);
            router.push('/');
        }, 1000);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-6 h-0.5 bg-black rounded-full" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Secure Access</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-sm font-medium text-gray-500">
                        Sign in to your premium account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-12 space-y-8">
                    <div className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            error={errors.email}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            error={errors.password}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                            />
                            <label
                                htmlFor="remember-me"
                                className="text-sm font-medium text-gray-600 cursor-pointer select-none"
                            >
                                Remember me
                            </label>
                        </div>

                        <Link
                            href="/forgot-password"
                            className="text-sm font-semibold text-black hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        className="h-14 bg-black text-white rounded-md font-semibold text-base hover:bg-gray-900 transition-all shadow-none"
                    >
                        Sign In
                    </Button>

                    <div className="text-center pt-4">
                        <p className="text-sm font-medium text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/signup"
                                className="text-black hover:underline font-semibold transition-colors duration-300 ml-1"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
