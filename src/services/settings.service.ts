import { ApiResponse } from '@/types/api';
import { ShippingSettings, ShippingSettingsPayload } from '@/types/storeSettings';
import { DEFAULT_SHIPPING_SETTINGS } from '@/lib/shippingUtils';

async function adminFetch<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const config: RequestInit = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };

  let response = await fetch(url, config);

  if (response.status === 401 || response.status === 403) {
    await fetch('/api/admin/auth/refresh', { method: 'POST', credentials: 'include' });
    response = await fetch(url, config);
  }

  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !data.status) {
    throw { message: data.message || 'Request failed', statusCode: data.statusCode || response.status };
  }
  return data;
}

export const settingsService = {
  async getShippingSettings(): Promise<ShippingSettings> {
    try {
      const res = await fetch('/api/settings/shipping', { cache: 'no-store' });
      const data = (await res.json()) as ApiResponse<ShippingSettings>;
      if (res.ok && data.status && data.data) return data.data;
    } catch {
      /* fall through to defaults */
    }
    return DEFAULT_SHIPPING_SETTINGS;
  },

  getAdminShippingSettings() {
    return adminFetch<ShippingSettings>('/api/admin/settings/shipping');
  },

  updateShippingSettings(payload: ShippingSettingsPayload) {
    return adminFetch<ShippingSettings>('/api/admin/settings/shipping', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
