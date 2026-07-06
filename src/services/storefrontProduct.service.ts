import { ApiResponse } from '@/types/api';
import { FilterSection, CategoryContextDto } from '@/types/filters';
import type { SerializedProduct } from '@/lib/productSerializer';
import { ProductListMeta } from '@/types/product';

async function publicFetch<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !data.status) {
    throw { message: data.message || 'Request failed', statusCode: data.statusCode || response.status };
  }
  return data;
}

export interface ProductFiltersResponse {
  context: CategoryContextDto;
  sections: FilterSection[];
}

export interface ProductListResponse {
  data: SerializedProduct[];
  context?: CategoryContextDto;
  meta?: ProductListMeta;
}

export const storefrontProductService = {
  async getFilters(params: { department?: string; category?: string; item?: string }) {
    const search = new URLSearchParams();
    if (params.department) search.set('department', params.department);
    if (params.category) search.set('category', params.category);
    if (params.item) search.set('item', params.item);
    const qs = search.toString();
    const res = await publicFetch<ProductFiltersResponse>(`/api/product/filters${qs ? `?${qs}` : ''}`);
    return res.data!;
  },

  async listProducts(query: URLSearchParams) {
    const res = (await publicFetch<SerializedProduct[]>(
      `/api/product?${query.toString()}`
    )) as ApiResponse<SerializedProduct[]> & { meta?: ProductListMeta; context?: CategoryContextDto };
    return {
      data: res.data || [],
      meta: res.meta,
      context: res.context,
    };
  },
};
