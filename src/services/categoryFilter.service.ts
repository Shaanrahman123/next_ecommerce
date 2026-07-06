import { ApiResponse } from '@/types/api';
import { CategoryFilterFieldDto } from '@/types/filters';

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

async function publicFetch<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !data.status) {
    throw { message: data.message || 'Request failed', statusCode: data.statusCode || response.status };
  }
  return data;
}

export const categoryFilterService = {
  listForSubCategory(subCategoryId: string) {
    return publicFetch<CategoryFilterFieldDto[]>(`/api/category-filters?subCategory=${subCategoryId}`);
  },

  adminList(subCategoryId?: string) {
    const qs = subCategoryId ? `?subCategory=${subCategoryId}` : '';
    return adminFetch<CategoryFilterFieldDto[]>(`/api/admin/category-filters${qs}`);
  },

  create(payload: { subCategory: string; key: string; label: string; sortOrder?: number }) {
    return adminFetch<CategoryFilterFieldDto>('/api/admin/category-filters', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: Partial<{ label: string; sortOrder: number; isActive: boolean }>) {
    return adminFetch<CategoryFilterFieldDto>(`/api/admin/category-filters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string) {
    return adminFetch<null>(`/api/admin/category-filters/${id}`, { method: 'DELETE' });
  },

  listPresets() {
    return adminFetch<string[]>('/api/admin/category-filters/presets');
  },

  applyPreset(subCategory: string, preset: string) {
    return adminFetch<CategoryFilterFieldDto[]>('/api/admin/category-filters/presets', {
      method: 'POST',
      body: JSON.stringify({ subCategory, preset }),
    });
  },

  getCatalog() {
    return adminFetch<
      Array<{ key: string; label: string; fieldUsageCount: number; optionCount: number }>
    >('/api/admin/category-filters/catalog');
  },
};
