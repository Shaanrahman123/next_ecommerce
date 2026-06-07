import {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  ResetPasswordPayload,
  ResendOtpPayload,
  SignupPayload,
  VerifyOtpPayload,
} from '@/types/auth';

async function authRequest(url: string, body?: unknown): Promise<AuthResponse> {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });

  const data = (await response.json()) as AuthResponse;

  if (!response.ok || !data.status) {
    throw {
      message: data.message || 'Request failed',
      statusCode: data.statusCode || response.status,
    };
  }

  return data;
}

export const authService = {
  login(payload: LoginPayload) {
    return authRequest('/api/auth/login', payload);
  },

  signup(payload: SignupPayload) {
    return authRequest('/api/auth/sign-up', payload);
  },

  logout() {
    return authRequest('/api/auth/logout');
  },

  refresh() {
    return authRequest('/api/auth/refresh');
  },

  forgotPassword(payload: ForgotPasswordPayload) {
    return authRequest('/api/auth/forgot-password', payload);
  },

  verifyOtp(payload: VerifyOtpPayload) {
    return authRequest('/api/auth/verify-otp', payload);
  },

  resetPassword(payload: ResetPasswordPayload) {
    return authRequest('/api/auth/reset-password', payload);
  },

  resendOtp(payload: ResendOtpPayload) {
    return authRequest('/api/auth/resend-otp', payload);
  },
};
