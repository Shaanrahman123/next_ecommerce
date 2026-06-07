'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/store/adminAuth';
import { useAdminAuthContext } from '@/providers/AdminAuthProvider';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isInitializing, hasHydrated } = useAdminAuthContext();
  const { isAuthenticated } = useAdminAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && hasHydrated && !isInitializing && !isAuthenticated) {
      router.replace('/admin');
    }
  }, [mounted, hasHydrated, isInitializing, isAuthenticated, router]);

  if (!mounted || !hasHydrated || isInitializing || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
