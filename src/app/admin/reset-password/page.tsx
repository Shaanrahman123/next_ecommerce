'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import {
  AuthLayout,
  AuthHeader,
  AuthErrorAlert,
  AuthSuccessCard,
  AuthTip,
  PasswordField,
  PasswordStrength,
} from '@/components/auth';
import { adminAuthService } from '@/services/admin.auth.service';
import { getAuthErrorMessage } from '@/lib/api/client';
import { validateStrongPassword, validateConfirmPassword } from '@/utils/validation';
import { ResetPasswordFormData } from '@/types/auth';

function AdminResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<ResetPasswordFormData>>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const passwordError = validateStrongPassword(formData.password);
    const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
    setErrors({ password: passwordError, confirmPassword: confirmError });
    return !passwordError && !confirmError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!email || !token) {
      setApiError('Invalid reset link. Please verify your code again.');
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      await adminAuthService.resetPassword({
        email,
        token,
        password: formData.password,
      });
      setIsSuccess(true);
      setTimeout(() => router.push('/admin'), 3000);
    } catch (err) {
      setApiError(getAuthErrorMessage(err, 'Failed to reset password. The code may be invalid or expired.'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthSuccessCard
        title="Success"
        description="Your password has been reset. Redirecting to admin login..."
      />
    );
  }

  return (
    <AuthLayout>
      <AuthHeader
        badge="Admin Security"
        title="Reset Password"
        description="Create a strong password for your admin account"
        subtitle={email ? `for ${email}` : undefined}
      />

      <form onSubmit={handleSubmit} className="mt-12 space-y-8">
        <AuthErrorAlert message={apiError} />

        <div className="space-y-6">
          <PasswordField
            label="New Password"
            value={formData.password}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, password: value }));
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            required
          />

          <PasswordStrength password={formData.password} />

          <PasswordField
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, confirmPassword: value }));
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            error={errors.confirmPassword}
            required
          />
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          className="h-14 bg-primary text-on-primary rounded-md font-semibold text-base hover:bg-primary-hover transition-all shadow-none"
        >
          Reset Password
        </Button>
      </form>

      <AuthTip
        label="Remember"
        text="Use a unique password that you don't use for other accounts."
      />
    </AuthLayout>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminResetPasswordContent />
    </Suspense>
  );
}
