'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import {
  AuthLayout,
  AuthHeader,
  AuthErrorAlert,
  AuthDivider,
  SocialAuthButtons,
} from '@/components/auth';
import { useAuthActions } from '@/hooks/useAuthActions';
import { validateEmail, validatePassword } from '@/utils/validation';
import { LoginFormData } from '@/types/auth';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { login, socialAuth, isLoading, error, setError } = useAuthActions();
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const next = { email: emailError, password: passwordError };
    setErrors(next);
    return !emailError && !passwordError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    await login({ email: formData.email, password: formData.password }, redirectTo);
  };

  const updateField = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <AuthLayout>
      <AuthHeader
        badge="Secure Access"
        title="Welcome Back"
        description="Sign in to your premium account"
      />

      <form onSubmit={handleSubmit} className="mt-12 space-y-8">
        <AuthErrorAlert message={error} />

        <div className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            error={errors.email}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
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
          <Link href="/forgot-password" className="text-sm font-semibold text-heading hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          className="h-14 bg-primary text-on-primary rounded-md font-semibold text-base hover:bg-primary-hover transition-all shadow-none"
        >
          Sign In
        </Button>

        <AuthDivider label="Or continue with" />
        <SocialAuthButtons
          onSocialAuth={(provider) => socialAuth(provider, 'login')}
          disabled={isLoading}
        />

        <div className="text-center pt-4">
          <p className="text-sm font-medium text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-heading hover:underline font-semibold transition-colors duration-300 ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
