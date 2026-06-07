export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt?: string;
}

export interface AdminAuthResponse {
  status: boolean;
  message: string;
  statusCode: number;
  user?: AdminUser;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminForgotPasswordPayload {
  email: string;
}

export interface AdminVerifyOtpPayload {
  email: string;
  otp: string;
}

export interface AdminResetPasswordPayload {
  email: string;
  token: string;
  password: string;
}

export interface AdminResendOtpPayload {
  email: string;
}
