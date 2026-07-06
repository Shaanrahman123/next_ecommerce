'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store';
import { getAuthErrorMessage } from '@/lib/api/client';
import { LoginPayload, SignupPayload, SocialProvider } from '@/types/auth';
import { mapAuthUserToStoreUser, buildSocialPayload } from '@/utils/auth';
import { mapProfileAddresses, mapProfileToStoreUser } from '@/utils/user';
import { userService } from '@/services/user.service';
import { LOGIN_TYPES } from '@/types';
import { useAddressStore } from '@/store';

export function useAuthActions() {
  const router = useRouter();
  const { login: setUser, logout: clearUser } = useAuthStore();
  const setAddresses = useAddressStore((s) => s.setAddresses);
  const clearAddresses = useAddressStore((s) => s.clearAddresses);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuthSuccess = useCallback(
    async (user: Parameters<typeof setUser>[0], redirectTo = '/') => {
      setUser(user);
      try {
        const profile = await userService.getProfile();
        if (profile.user) {
          setUser(mapProfileToStoreUser(profile.user));
          setAddresses(mapProfileAddresses(profile.user));
        }
      } catch {
        // Profile load optional on first login
      }
      router.push(redirectTo);
    },
    [setUser, setAddresses, router]
  );

  const login = useCallback(
    async (payload: LoginPayload, redirectTo?: string) => {
      setIsLoading(true);
      setError('');
      try {
        const data = await authService.login({ ...payload, loginType: payload.loginType ?? LOGIN_TYPES.DIRECT });
        if (data.user) handleAuthSuccess(mapAuthUserToStoreUser(data.user), redirectTo);
      } catch (err) {
        setError(getAuthErrorMessage(err, 'Invalid email or password'));
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const signup = useCallback(
    async (payload: SignupPayload) => {
      setIsLoading(true);
      setError('');
      try {
        const data = await authService.signup({ ...payload, loginType: payload.loginType ?? LOGIN_TYPES.DIRECT });
        if (data.user) handleAuthSuccess(mapAuthUserToStoreUser(data.user));
      } catch (err) {
        setError(getAuthErrorMessage(err, 'Registration failed. Please try again.'));
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const socialAuth = useCallback(
    async (provider: SocialProvider, mode: 'login' | 'signup') => {
      setIsLoading(true);
      setError('');
      try {
        const payload = buildSocialPayload(provider);
        const data =
          mode === 'login'
            ? await authService.login(payload)
            : await authService.signup(payload);
        if (data.user) handleAuthSuccess(mapAuthUserToStoreUser(data.user));
      } catch (err) {
        setError(getAuthErrorMessage(err, `${provider} authentication failed`));
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Clear local state even if API fails
    } finally {
      clearUser();
      clearAddresses();
      router.push('/');
    }
  }, [clearUser, clearAddresses, router]);

  return { login, signup, socialAuth, logout, isLoading, error, setError };
}
