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
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[var(--theme-primary)] mb-2 uppercase tracking-wide">
                        Welcome Back
                    </h1>
                    <p className="text-xs text-[var(--theme-text-secondary)]">
                        Sign in to your account to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
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
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-[var(--theme-border)] text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 block text-sm text-[var(--theme-text-secondary)]"
                            >
                                Remember me
                            </label>
                        </div>

                        <Link
                            href="/forgot-password"
                            className="text-sm text-[var(--theme-primary)] hover:text-[var(--theme-accent)] transition-colors duration-300"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Sign In
                    </Button>

                    <div className="text-center">
                        <p className="text-sm text-[var(--theme-text-secondary)]">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/signup"
                                className="text-[var(--theme-primary)] hover:text-[var(--theme-accent)] font-medium transition-colors duration-300"
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
