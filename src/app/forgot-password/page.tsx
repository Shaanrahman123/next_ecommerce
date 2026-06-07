'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import {
  AuthLayout,
  AuthHeader,
  AuthErrorAlert,
  AuthSuccessCard,
  AuthBackLink,
  AuthTip,
} from '@/components/auth';
import { authService } from '@/services/auth.service';
import { getAuthErrorMessage } from '@/lib/api/client';
import { validateEmail } from '@/utils/validation';

export default function ForgotPasswordPage() {
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
      await authService.forgotPassword({ email });
      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
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
    <AuthLayout>
      <AuthHeader
        badge="Recovery"
        title="Forgot Password?"
        description="Enter your email address to receive a recovery code"
      />

      <form onSubmit={handleSubmit} className="mt-12 space-y-8">
        <AuthErrorAlert message={error} />

        <div className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
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

        <AuthBackLink href="/login" />
      </form>

      <AuthTip
        label="Tip"
        text="Check your spam folder if you don't receive the email within a few minutes."
      />
    </AuthLayout>
  );
}
