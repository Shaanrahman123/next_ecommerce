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
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-6 h-0.5 bg-black rounded-full" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Join the Vault</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Create Account
                    </h1>
                    <p className="text-sm font-medium text-gray-500">
                        Join our premium community
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-12 space-y-8">
                    <div className="space-y-6">
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

                    <div className="flex items-center gap-3">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                        />
                        <label htmlFor="terms" className="text-sm font-medium text-gray-600 cursor-pointer select-none">
                            I agree to the{' '}
                            <Link
                                href="/terms"
                                className="text-black hover:underline font-semibold transition-colors duration-300"
                            >
                                Terms
                            </Link>{' '}
                            and{' '}
                            <Link
                                href="/privacy"
                                className="text-black hover:underline font-semibold transition-colors duration-300"
                            >
                                Privacy
                            </Link>
                        </label>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        className="h-14 bg-black text-white rounded-md font-semibold text-base hover:bg-gray-900 transition-all shadow-none"
                    >
                        Create Account
                    </Button>

                    <div className="text-center pt-4">
                        <p className="text-sm font-medium text-gray-600">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-black hover:underline font-semibold transition-colors duration-300 ml-1"
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
