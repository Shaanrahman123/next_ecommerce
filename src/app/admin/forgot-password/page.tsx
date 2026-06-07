'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { AuthSuccessCard } from '@/components/auth';
import { adminAuthService } from '@/services/admin.auth.service';
import { getAuthErrorMessage } from '@/lib/api/client';
import { validateEmail } from '@/utils/validation';

export default function AdminForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await adminAuthService.forgotPassword({ email });
      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/admin/verify-otp?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Failed to send recovery code. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthSuccessCard
        title="Check Your Email"
        description="We've sent a 6-digit verification code to"
        highlight={email}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-0.5 bg-primary rounded-full" />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Recovery</span>
          </div>
          <h1 className="text-3xl font-bold text-heading tracking-tight">Reset Password</h1>
          <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto">
            Authorized email required for password recovery
          </p>
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            className="h-14 bg-primary text-on-primary rounded-md font-semibold text-base hover:bg-primary-hover transition-all shadow-none"
          >
            Send Verification Code
          </Button>

          <div className="text-center pt-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm font-semibold text-heading hover:underline"
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
