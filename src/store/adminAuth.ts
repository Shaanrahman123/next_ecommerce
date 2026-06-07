import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser } from '@/types/admin/auth';

interface AdminAuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (admin: AdminUser) => void;
  logout: () => void;
  setAdmin: (admin: AdminUser) => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      login: (admin) => set({ admin, isAuthenticated: true }),
      logout: () => set({ admin: null, isAuthenticated: false }),
      setAdmin: (admin) => set({ admin, isAuthenticated: true }),
    }),
    { name: 'admin-auth-storage' }
  )
);

export function mapAdminToDisplayName(admin: AdminUser) {
  return `${admin.firstName} ${admin.lastName}`.trim();
}
