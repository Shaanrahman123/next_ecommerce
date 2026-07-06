import { getAuthErrorMessage } from '@/lib/api/client';
import {
  AddressPayload,
  AddressResponse,
  ChangePasswordPayload,
  ProfileResponse,
  UpdateProfilePayload,
} from '@/types/user';

async function userRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };

  let response = await fetch(url, config);

  // If unauthorized, attempt a silent token refresh and retry once
  if (response.status === 401) {
    const refreshed = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshed.ok) {
      response = await fetch(url, config);
    }
  }

  const data = (await response.json()) as T & { status: boolean; message: string; statusCode: number };

  if (!response.ok || !data.status) {
    throw { message: data.message || 'Request failed', statusCode: data.statusCode || response.status };
  }

  return data;
}

export const userService = {
  getProfile() {
    return userRequest<ProfileResponse>('/api/user/profile');
  },

  updateProfile(payload: UpdateProfilePayload) {
    return userRequest<ProfileResponse>('/api/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  changePassword(payload: ChangePasswordPayload) {
    return userRequest<ProfileResponse>('/api/user/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getAddresses() {
    return userRequest<AddressResponse>('/api/user/addresses');
  },

  addAddress(payload: AddressPayload) {
    return userRequest<AddressResponse>('/api/user/addresses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateAddress(id: string, payload: Partial<AddressPayload>) {
    return userRequest<AddressResponse>(`/api/user/addresses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteAddress(id: string) {
    return userRequest<AddressResponse>(`/api/user/addresses/${id}`, {
      method: 'DELETE',
    });
  },
};

export { getAuthErrorMessage };
