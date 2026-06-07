'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuthService, getAuthErrorMessage } from '@/services/admin.auth.service';
import { useAdminAuthStore } from '@/store/adminAuth';

export function useAdminAuthActions() {
  const router = useRouter();
  const { login: setAdmin, logout: clearAdmin } = useAdminAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError('');
      try {
        const data = await adminAuthService.login({ email, password });
        if (data.user) {
          setAdmin(data.user);
          router.push('/admin/dashboard');
        }
      } catch (err) {
        setError(getAuthErrorMessage(err, 'Invalid admin credentials'));
      } finally {
        setIsLoading(false);
      }
    },
    [setAdmin, router]
  );

  const logout = useCallback(async () => {
    try {
      await adminAuthService.logout();
    } catch {
      // clear local state regardless
    } finally {
      clearAdmin();
      router.push('/admin');
    }
  }, [clearAdmin, router]);

  return { login, logout, isLoading, error, setError };
}
