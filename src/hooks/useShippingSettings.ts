'use client';

import { useEffect, useState } from 'react';
import { settingsService } from '@/services/settings.service';
import { DEFAULT_SHIPPING_SETTINGS } from '@/lib/shippingUtils';
import type { ShippingSettings } from '@/types/storeSettings';

export function useShippingSettings() {
  const [settings, setSettings] = useState<ShippingSettings>(DEFAULT_SHIPPING_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    settingsService
      .getShippingSettings()
      .then((data) => {
        if (mounted) setSettings(data);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { settings, isLoading };
}
