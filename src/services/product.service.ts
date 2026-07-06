import { ApiResponse } from '@/types/api';
import {
  Product,
  ProductFormPayload,
  ProductListMeta,
  SpecOptionsMap,
} from '@/types/product';
import type { StockFilter } from '@/lib/inventoryUtils';

export interface InventoryStats {
  totalProducts: number;
  totalUnits: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  inactive: number;
  lowStockThreshold: number;
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

  const data = (await response.json()) as ApiResponse<T> & { meta?: ProductListMeta };
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

export const productService = {
  list(params: {
    page?: number;
    limit?: number;
    search?: string;
    superCategory?: string;
    category?: string;
    subCategory?: string;
    inStock?: boolean;
    all?: boolean;
  } = {}) {
    return adminFetch<Product[]>(`/api/product${buildQuery({ ...params, all: params.all ?? true })}`) as Promise<
      ApiResponse<Product[]> & { meta?: ProductListMeta }
    >;
  },

  getById(id: string) {
    return adminFetch<Product>(`/api/product/${id}`);
  },

  create(payload: ProductFormPayload) {
    return adminFetch<Product>('/api/product', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: Partial<ProductFormPayload>) {
    return adminFetch<Product>(`/api/product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string) {
    return adminFetch<null>(`/api/product/${id}`, { method: 'DELETE' });
  },

  getSpecOptions(params: { key?: string; subCategory?: string } = {}) {
    return adminFetch<SpecOptionsMap>(`/api/product/spec-options${buildQuery(params)}`);
  },

  addSpecOption(payload: { key: string; value: string; subCategory?: string }) {
    return adminFetch<{ key: string; value: string }>('/api/product/spec-options', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getInventory(params: {
    page?: number;
    limit?: number;
    search?: string;
    stockFilter?: StockFilter;
  } = {}) {
    return adminFetch<Product[]>(`/api/admin/products/inventory${buildQuery(params)}`) as Promise<
      ApiResponse<Product[]> & { meta?: ProductListMeta & { stockFilter?: StockFilter }; stats?: InventoryStats }
    >;
  },

  updateStock(id: string, payload: { stockQuantity: number; inStock?: boolean }) {
    const inStock = payload.inStock ?? payload.stockQuantity > 0;
    return adminFetch<Product>(`/api/product/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ stockQuantity: payload.stockQuantity, inStock }),
    });
  },
};
