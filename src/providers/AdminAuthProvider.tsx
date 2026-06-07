'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { adminAuthService } from '@/services/admin.auth.service';
import { useAdminAuthStore } from '@/store/adminAuth';

interface AdminAuthContextValue {
  isInitializing: boolean;
  hasHydrated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  isInitializing: true,
  hasHydrated: false,
});

export function useAdminAuthContext() {
  return useContext(AdminAuthContext);
}

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  const [isInitializing, setIsInitializing] = useState(isAdminRoute);
  const [hasHydrated, setHasHydrated] = useState(false);
  const logout = useAdminAuthStore((s) => s.logout);
  const setAdmin = useAdminAuthStore((s) => s.setAdmin);

  useEffect(() => {
    const finishHydration = () => setHasHydrated(true);

    if (useAdminAuthStore.persist.hasHydrated()) {
      finishHydration();
    }

    return useAdminAuthStore.persist.onFinishHydration(finishHydration);
  }, []);

  useEffect(() => {
    if (!isAdminRoute) {
      setIsInitializing(false);
      return;
    }

    if (!hasHydrated) return;

    let cancelled = false;

    async function restoreAdminSession() {
      setIsInitializing(true);

      try {
        const data = await adminAuthService.refresh();
        if (!cancelled && data.user) {
          setAdmin(data.user);
        }
      } catch {
        if (!cancelled && useAdminAuthStore.getState().isAuthenticated) {
          logout();
        }
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    }

    restoreAdminSession();

    return () => {
      cancelled = true;
    };
  }, [isAdminRoute, hasHydrated, logout, setAdmin]);

  return (
    <AdminAuthContext.Provider value={{ isInitializing: isAdminRoute ? isInitializing : false, hasHydrated }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
