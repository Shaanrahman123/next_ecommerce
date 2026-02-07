'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store';

export default function SignupPage() {
    const router = useRouter();
    const { signup } = useAuthStore();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors: {
            name?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        if (!formData.name) {
            newErrors.name = 'Name is required';
        }

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
            // Mock signup - in production, this would be an API call
            signup({
                id: Date.now().toString(),
                email: formData.email,
                name: formData.name,
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
                        Create Account
                    </h1>
                    <p className="text-xs text-[var(--theme-text-secondary)]">
                        Join us and start shopping
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={errors.name}
                            required
                        />

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
                            helperText="Must be at least 6 characters"
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, confirmPassword: e.target.value })
                            }
                            error={errors.confirmPassword}
                            required
                        />
                    </div>

                    <div className="flex items-start">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 mt-1 rounded border-[var(--theme-border)] text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-[var(--theme-text-secondary)]">
                            I agree to the{' '}
                            <Link
                                href="/terms"
                                className="text-[var(--theme-primary)] hover:text-[var(--theme-accent)] transition-colors duration-300"
                            >
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link
                                href="/privacy"
                                className="text-[var(--theme-primary)] hover:text-[var(--theme-accent)] transition-colors duration-300"
                            >
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Create Account
                    </Button>

                    <div className="text-center">
                        <p className="text-sm text-[var(--theme-text-secondary)]">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-[var(--theme-primary)] hover:text-[var(--theme-accent)] font-medium transition-colors duration-300"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
