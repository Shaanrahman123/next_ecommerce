import type { CreateOrderPayload, OrderSummary, OrderListItem, AdminOrderListItem } from '@/types/order';
import type { OrderStatus } from '@/types/order';
import type { CartProductSnapshot } from '@/types/cart';

async function orderFetch<T>(url: string, options: RequestInit = {}): Promise<{
  status: boolean;
  message: string;
  statusCode: number;
  data?: T;
  meta?: Record<string, unknown>;
  code?: string;
}> {
  const config: RequestInit = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };

  let response = await fetch(url, config);

  // If unauthorized, attempt a silent token refresh and retry once
  if (response.status === 401) {
    const refreshed = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshed.ok) {
      response = await fetch(url, config);
    }
  }

  return response.json();
}

async function adminOrderFetch<T>(url: string, options: RequestInit = {}): Promise<{
  status: boolean;
  message: string;
  statusCode: number;
  data?: T;
  meta?: Record<string, unknown>;
}> {
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
  return response.json();
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload) {
    const res = await orderFetch<OrderSummary>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.status) {
      throw { message: res.message, statusCode: res.statusCode, code: res.code };
    }
    return res;
  },

  async listOrders() {
    const res = await orderFetch<OrderListItem[]>('/api/orders');
    if (!res.status) throw { message: res.message, statusCode: res.statusCode };
    return res;
  },

  async getOrder(id: string) {
    const res = await orderFetch<OrderSummary>(`/api/orders/${id}`);
    if (!res.status) throw { message: res.message, statusCode: res.statusCode };
    return res;
  },

  async cancelOrder(id: string, reason?: string) {
    const res = await orderFetch<OrderSummary>(`/api/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    if (!res.status) throw { message: res.message, statusCode: res.statusCode, code: res.code };
    return res;
  },

  async requestReturn(id: string, reason?: string) {
    const res = await orderFetch<OrderSummary>(`/api/orders/${id}/return`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    if (!res.status) throw { message: res.message, statusCode: res.statusCode, code: res.code };
    return res;
  },

  async fetchCartProducts(productIds: string[]) {
    if (!productIds.length) return {} as Record<string, CartProductSnapshot>;
    const res = await fetch(`/api/product/stock?ids=${productIds.join(',')}`, { cache: 'no-store' });
    const data = await res.json();
    return (data.data || {}) as Record<string, CartProductSnapshot>;
  },

  /** @deprecated use fetchCartProducts */
  async fetchProductStock(productIds: string[]) {
    return this.fetchCartProducts(productIds);
  },

  admin: {
    async listOrders(params: { page?: number; status?: OrderStatus; search?: string } = {}) {
      const qs = new URLSearchParams();
      if (params.page) qs.set('page', String(params.page));
      if (params.status) qs.set('status', params.status);
      if (params.search) qs.set('search', params.search);
      const query = qs.toString();
      const res = await adminOrderFetch<AdminOrderListItem[]>(`/api/admin/orders${query ? `?${query}` : ''}`);
      if (!res.status) throw { message: res.message, statusCode: res.statusCode };
      return res;
    },

    async getOrder(id: string) {
      const res = await adminOrderFetch<AdminOrderListItem>(`/api/admin/orders/${id}`);
      if (!res.status) throw { message: res.message, statusCode: res.statusCode };
      return res;
    },

    async updateStatus(id: string, status: OrderStatus) {
      const res = await adminOrderFetch<AdminOrderListItem>(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (!res.status) throw { message: res.message, statusCode: res.statusCode };
      return res;
    },

    async updateOrderFields(
      id: string,
      fields: { status?: OrderStatus; returnStatus?: string; refundStatus?: string }
    ) {
      const res = await adminOrderFetch<AdminOrderListItem>(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(fields),
      });
      if (!res.status) throw { message: res.message, statusCode: res.statusCode };
      return res;
    },
  },
};
