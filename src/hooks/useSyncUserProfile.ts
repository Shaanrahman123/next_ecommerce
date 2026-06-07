'use client';

import { useCallback } from 'react';
import { userService } from '@/services/user.service';
import { useAuthStore, useAddressStore } from '@/store';
import { mapProfileAddresses, mapProfileToStoreUser } from '@/utils/user';

export function useSyncUserProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  const setAddresses = useAddressStore((s) => s.setAddresses);

  const syncProfile = useCallback(async () => {
    try {
      const data = await userService.getProfile();
      if (data.user) {
        setUser(mapProfileToStoreUser(data.user));
        setAddresses(mapProfileAddresses(data.user));
      }
    } catch {
      // Profile sync failed silently — user may not be logged in
    }
  }, [setUser, setAddresses]);

  return { syncProfile };
}
