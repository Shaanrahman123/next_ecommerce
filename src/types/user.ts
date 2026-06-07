import { Address } from '@/types';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  loginType?: string;
  createdAt: string;
  addresses: Address[];
}

export interface ProfileResponse {
  status: boolean;
  message: string;
  statusCode: number;
  user?: UserProfile;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface AddressPayload {
  type?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface AddressResponse {
  status: boolean;
  message: string;
  statusCode: number;
  address?: Address;
  addresses?: Address[];
  user?: UserProfile;
}
