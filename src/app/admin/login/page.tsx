'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AdminLoginPage() {
    const router = useRouter();
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
            setIsLoading(false);
            router.push('/admin/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-6 h-0.5 bg-black rounded-full" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Admin Access</span>
                    </div>
                    <h1 className="text-section-title font-black text-gray-900 uppercase tracking-tight">
                        Dashboard Login
                    </h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Secure access to store management
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-12 space-y-8">
                    <div className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="admin@example.com"
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
                                className="text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer select-none"
                            >
                                Remember me
                            </label>
                        </div>

                        <Link
                            href="/admin/forgot-password"
                            className="text-[10px] font-black text-black hover:underline uppercase tracking-widest"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        className="h-14 bg-black text-white rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 transition-all shadow-none"
                    >
                        Enter Dashboard
                    </Button>

                    <div className="text-center pt-4">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            Authorized Personnel Only
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
