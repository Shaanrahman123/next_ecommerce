import { SerializedUser, SerializedUserAddress } from '@/lib/userSerializer';

export type AdminUser = SerializedUser;
export type AdminUserAddress = SerializedUserAddress;

export interface AdminUserStats {
  total: number;
  customers: number;
  admins: number;
  verified: number;
  unverified: number;
  directLogin: number;
  socialLogin: number;
}

export interface AdminUserListMeta {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminUserListResponse {
  users: AdminUser[];
  stats: AdminUserStats;
  meta: AdminUserListMeta;
}

export interface UpdateAdminUserPayload {
  isVerified?: boolean;
}
