'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  splitFullName,
} from '@/utils/validation';
import { SignupFormData } from '@/types/auth';

export default function SignupPage() {
  const { signup, socialAuth, isLoading, error, setError } = useAuthActions();
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});

  const validateForm = () => {
    const next: Partial<SignupFormData> = {};
    if (!formData.name.trim()) next.name = 'Name is required';
    next.email = validateEmail(formData.email);
    next.password = validatePassword(formData.password);
    next.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    const { firstName, lastName } = splitFullName(formData.name);
    await signup({
      firstName,
      lastName,
      email: formData.email,
      password: formData.password,
    });
  };

  const updateField = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <AuthLayout>
      <AuthHeader
        badge="Join the Vault"
        title="Create Account"
        description="Join our premium community"
      />

      <form onSubmit={handleSubmit} className="mt-12 space-y-8">
        <AuthErrorAlert message={error} />

        <div className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            error={errors.name}
            required
          />
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
            helperText="Must be at least 6 characters"
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
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
            className="w-4 h-4 rounded border-gray-300 text-heading focus:ring-primary cursor-pointer"
          />
          <label htmlFor="terms" className="text-sm font-medium text-gray-600 cursor-pointer select-none">
            I agree to the{' '}
            <Link href="/terms" className="text-heading hover:underline font-semibold">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-heading hover:underline font-semibold">Privacy</Link>
          </label>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          className="h-14 bg-primary text-on-primary rounded-md font-semibold text-base hover:bg-primary-hover transition-all shadow-none"
        >
          Create Account
        </Button>

        <AuthDivider label="Or sign up with" />
        <SocialAuthButtons
          onSocialAuth={(provider) => socialAuth(provider, 'signup')}
          disabled={isLoading}
        />

        <div className="text-center pt-4">
          <p className="text-sm font-medium text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-heading hover:underline font-semibold transition-colors duration-300 ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
