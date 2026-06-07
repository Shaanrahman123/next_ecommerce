'use client';

import { useCallback, useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { getAuthErrorMessage } from '@/lib/api/client';

const RESEND_COOLDOWN = 60;

export function useResendOtp(email: string) {
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const resend = useCallback(async () => {
    if (!canResend || !email || isResending) return;

    setIsResending(true);
    setError('');
    setMessage('');

    try {
      const data = await authService.resendOtp({ email });
      setMessage(data.message);
      setCanResend(false);
      setTimer(RESEND_COOLDOWN);
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Failed to resend code. Please try again.'));
    } finally {
      setIsResending(false);
    }
  }, [canResend, email, isResending]);

  const resetTimer = useCallback(() => {
    setTimer(RESEND_COOLDOWN);
    setCanResend(false);
  }, []);

  return { timer, canResend, isResending, message, error, resend, resetTimer };
}
