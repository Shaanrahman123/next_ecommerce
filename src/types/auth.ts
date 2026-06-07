import { LoginType } from '@/types';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  loginType?: LoginType;
  createdAt?: string;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  statusCode: number;
  user?: AuthUser;
}

export interface LoginPayload {
  email: string;
  password?: string;
  loginType?: LoginType;
  firstName?: string;
  lastName?: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  loginType?: LoginType;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
}

export interface ResendOtpPayload {
  email: string;
}

export type SocialProvider = 'google' | 'facebook' | 'apple';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}
