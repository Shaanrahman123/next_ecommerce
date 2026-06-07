'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { useAuthStore, useAddressStore } from '@/store';
import { mapAuthUserToStoreUser } from '@/utils/auth';
import { userService } from '@/services/user.service';
import { mapProfileAddresses, mapProfileToStoreUser } from '@/utils/user';

interface AuthContextValue {
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextValue>({ isInitializing: true });

export function useAuthContext() {
  return useContext(AuthContext);
}

async function loadFullProfile(
  setUser: (user: ReturnType<typeof mapProfileToStoreUser>) => void,
  setAddresses: (addresses: ReturnType<typeof mapProfileAddresses>) => void
) {
  const data = await userService.getProfile();
  if (data.user) {
    setUser(mapProfileToStoreUser(data.user));
    setAddresses(mapProfileAddresses(data.user));
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const { isAuthenticated, login, logout, setUser } = useAuthStore();
  const setAddresses = useAddressStore((s) => s.setAddresses);
  const clearAddresses = useAddressStore((s) => s.clearAddresses);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const data = await authService.refresh();
        if (!cancelled && data.user) {
          login(mapAuthUserToStoreUser(data.user));
          await loadFullProfile(setUser, setAddresses);
        }
      } catch {
        if (!cancelled && isAuthenticated) {
          logout();
          clearAddresses();
        }
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
}
