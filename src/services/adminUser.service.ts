import { ApiResponse } from '@/types/api';
import {
  AdminUser,
  AdminUserListMeta,
  AdminUserListResponse,
  AdminUserStats,
  UpdateAdminUserPayload,
} from '@/types/adminUser';

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

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const adminUserService = {
  async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'user' | 'admin' | 'all';
    verified?: 'true' | 'false' | 'all';
    loginType?: 'direct' | 'social' | 'all';
  } = {}) {
    const res = await adminFetch<AdminUser[]>(
      `/api/admin/users${buildQuery({
        page: params.page,
        limit: params.limit,
        search: params.search,
        role: params.role === 'all' ? undefined : params.role,
        verified: params.verified === 'all' ? undefined : params.verified,
        loginType: params.loginType === 'all' ? undefined : params.loginType,
      })}`
    );

    const body = res as ApiResponse<AdminUser[]> & {
      stats?: AdminUserStats;
      meta?: AdminUserListMeta;
    };

    return {
      users: body.data || [],
      stats: body.stats || {
        total: 0,
        customers: 0,
        admins: 0,
        verified: 0,
        unverified: 0,
        directLogin: 0,
        socialLogin: 0,
      },
      meta: body.meta || {
        totalDocs: 0,
        limit: 10,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    } satisfies AdminUserListResponse;
  },

  getById(id: string) {
    return adminFetch<AdminUser>(`/api/admin/users/${id}`);
  },

  update(id: string, payload: UpdateAdminUserPayload) {
    return adminFetch<AdminUser>(`/api/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
