'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAdminAuthActions } from '@/hooks/useAdminAuthActions';
import { useAdminAuthStore } from '@/store/adminAuth';
import { useAdminAuthContext } from '@/providers/AdminAuthProvider';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isInitializing, hasHydrated } = useAdminAuthContext();
  const { isAuthenticated } = useAdminAuthStore();
  const { login, isLoading, error, setError } = useAdminAuthActions();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (hasHydrated && !isInitializing && isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [hasHydrated, isInitializing, isAuthenticated, router]);

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
    await login(formData.email, formData.password);
  };

  if (!hasHydrated || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-0.5 bg-primary rounded-full" />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Admin Access</span>
          </div>
          <h1 className="text-3xl font-bold text-heading tracking-tight">Dashboard Login</h1>
          <p className="text-sm font-medium text-gray-500">Secure access to store management</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (error) setError('');
              }}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (error) setError('');
              }}
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
                className="h-4 w-4 rounded border-gray-300 text-heading focus:ring-primary cursor-pointer"
              />
              <label htmlFor="remember-me" className="text-sm font-medium text-gray-600 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            <Link href="/admin/forgot-password" className="text-sm font-semibold text-heading hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            className="h-14 bg-primary text-on-primary rounded-md font-semibold text-base hover:bg-primary-hover transition-all shadow-none"
          >
            Enter Dashboard
          </Button>

          <div className="text-center pt-4">
            <p className="text-xs font-medium text-gray-500">Authorized Personnel Only</p>
          </div>
        </form>
      </div>
    </div>
  );
}
