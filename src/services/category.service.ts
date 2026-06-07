import { ApiResponse } from '@/types/api';
import { getAuthErrorMessage } from '@/lib/api/client';
import {
  CategoryGroup,
  CategoryTreeDepartment,
  DepartmentFormPayload,
  GroupFormPayload,
  ItemFormPayload,
  SubCategoryItem,
  SuperCategory,
} from '@/types/category';

async function publicFetch<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !data.status) {
    throw { message: data.message || 'Request failed', statusCode: data.statusCode || response.status };
  }
  return data;
}

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

function buildQuery(params: Record<string, string | boolean | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const categoryService = {
  getTree(activeOnly = true) {
    return publicFetch<CategoryTreeDepartment[]>(
      `/api/category/tree${buildQuery({ activeOnly })}`
    );
  },

  // Departments (Super Categories)
  listDepartments(all = true) {
    return adminFetch<SuperCategory[]>(`/api/super-category${buildQuery({ all })}`);
  },

  createDepartment(payload: DepartmentFormPayload) {
    return adminFetch<SuperCategory>('/api/super-category', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateDepartment(id: string, payload: Partial<DepartmentFormPayload>) {
    return adminFetch<SuperCategory>(`/api/super-category/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteDepartment(id: string) {
    return adminFetch<null>(`/api/super-category/${id}`, { method: 'DELETE' });
  },

  // Groups (Categories)
  listGroups(params: { all?: boolean; superCategory?: string } = { all: true }) {
    return adminFetch<CategoryGroup[]>(`/api/category${buildQuery(params)}`);
  },

  createGroup(payload: GroupFormPayload) {
    return adminFetch<CategoryGroup>('/api/category', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateGroup(id: string, payload: Partial<GroupFormPayload>) {
    return adminFetch<CategoryGroup>(`/api/category/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteGroup(id: string) {
    return adminFetch<null>(`/api/category/${id}`, { method: 'DELETE' });
  },

  // Items (Sub Categories)
  listItems(params: { all?: boolean; category?: string } = { all: true }) {
    return adminFetch<SubCategoryItem[]>(`/api/sub-category${buildQuery(params)}`);
  },

  createItem(payload: ItemFormPayload) {
    return adminFetch<SubCategoryItem>('/api/sub-category', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateItem(id: string, payload: Partial<ItemFormPayload>) {
    return adminFetch<SubCategoryItem>(`/api/sub-category/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteItem(id: string) {
    return adminFetch<null>(`/api/sub-category/${id}`, { method: 'DELETE' });
  },
};

export { getAuthErrorMessage };
