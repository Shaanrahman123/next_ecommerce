import { getAuthErrorMessage } from '@/lib/api/client';
import {
  AdminAuthResponse,
  AdminForgotPasswordPayload,
  AdminLoginPayload,
  AdminResetPasswordPayload,
  AdminResendOtpPayload,
  AdminVerifyOtpPayload,
} from '@/types/admin/auth';

async function adminAuthRequest(url: string, body?: unknown): Promise<AdminAuthResponse> {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });

  const data = (await response.json()) as AdminAuthResponse;

  if (!response.ok || !data.status) {
    throw {
      message: data.message || 'Request failed',
      statusCode: data.statusCode || response.status,
    };
  }

  return data;
}

export const adminAuthService = {
  login(payload: AdminLoginPayload) {
    return adminAuthRequest('/api/admin/auth/login', payload);
  },

  logout() {
    return adminAuthRequest('/api/admin/auth/logout');
  },

  refresh() {
    return adminAuthRequest('/api/admin/auth/refresh');
  },

  forgotPassword(payload: AdminForgotPasswordPayload) {
    return adminAuthRequest('/api/admin/auth/forgot-password', payload);
  },

  verifyOtp(payload: AdminVerifyOtpPayload) {
    return adminAuthRequest('/api/admin/auth/verify-otp', payload);
  },

  resetPassword(payload: AdminResetPasswordPayload) {
    return adminAuthRequest('/api/admin/auth/reset-password', payload);
  },

  resendOtp(payload: AdminResendOtpPayload) {
    return adminAuthRequest('/api/admin/auth/resend-otp', payload);
  },
};

export { getAuthErrorMessage };
