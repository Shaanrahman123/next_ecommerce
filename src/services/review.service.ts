import type { CreateReviewPayload, ProductReview } from '@/types/review';

async function reviewFetch<T>(url: string, options: RequestInit = {}): Promise<{
  status: boolean;
  message: string;
  statusCode: number;
  data?: T;
}> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return response.json();
}

export const reviewService = {
  async listForOrder(orderId: string) {
    const res = await reviewFetch<ProductReview[]>(`/api/reviews?orderId=${orderId}`);
    if (!res.status) throw { message: res.message, statusCode: res.statusCode };
    return res;
  },

  async listMine() {
    const res = await reviewFetch<ProductReview[]>('/api/reviews');
    if (!res.status) throw { message: res.message, statusCode: res.statusCode };
    return res;
  },

  async listForProduct(productId: string) {
    const res = await fetch(`/api/reviews/product/${productId}`, { cache: 'no-store' });
    const json = await res.json();
    if (!json.status) throw { message: json.message, statusCode: json.statusCode };
    return json as { status: boolean; message: string; statusCode: number; data?: ProductReview[] };
  },

  async createReview(payload: CreateReviewPayload) {
    const res = await reviewFetch<ProductReview>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.status) throw { message: res.message, statusCode: res.statusCode, code: (res as { code?: string }).code };
    return res;
  },

  admin: {
    async listReviews(status?: string) {
      const qs = status ? `?status=${status}` : '';
      const res = await fetch(`/api/admin/reviews${qs}`, { credentials: 'include' });
      return res.json();
    },

    async updateReviewStatus(id: string, status: 'published' | 'hidden') {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      return res.json();
    },
  },
};
