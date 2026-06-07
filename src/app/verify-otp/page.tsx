'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import {
  AuthLayout,
  AuthHeader,
  AuthBackLink,
  AuthTip,
  OtpInput,
  ResendOtpButton,
} from '@/components/auth';
import { authService } from '@/services/auth.service';
import { getAuthErrorMessage } from '@/lib/api/client';
import { useResendOtp } from '@/hooks/useResendOtp';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { timer, canResend, isResending, message, error: resendError, resend, resetTimer } =
    useResendOtp(email);

  const handleVerify = async (otpCode: string) => {
    if (!email) {
      setError('Email is missing. Please start from forgot password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.verifyOtp({ email, otp: otpCode });
      router.push(`/reset-password?email=${encodeURIComponent(email)}&token=${otpCode}`);
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Invalid verification code. Please try again.'));
      setOtp(['', '', '', '', '', '']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    handleVerify(code);
  };

  const handleResend = async () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    resetTimer();
    await resend();
  };

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <AuthLayout>
      <AuthHeader
        badge="Identity Verification"
        title="Verify Your Email"
        description="We've sent a 6-digit code to"
        subtitle={email || 'your email'}
      />

      <form onSubmit={handleSubmit} className="mt-12 space-y-8">
        <OtpInput
          value={otp}
          onChange={setOtp}
          onComplete={handleVerify}
          disabled={isLoading}
          error={error}
        />

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          disabled={!isComplete || isLoading}
          className="h-14 bg-primary text-on-primary rounded-md font-semibold text-base hover:bg-primary-hover transition-all shadow-none"
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Button>

        <ResendOtpButton
          canResend={canResend}
          timer={timer}
          isResending={isResending}
          onResend={handleResend}
          message={message}
          error={resendError}
        />

        <AuthBackLink href="/forgot-password" label="Back" />
      </form>

      <AuthTip
        label="Security"
        text="Never share this code with anyone. Our team will never ask for it."
      />
    </AuthLayout>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}
