import { ApiResponse } from '@/types/api';
import { CmsPage, CmsPageFormPayload, HeroSlide, HeroSlideFormPayload } from '@/types/cms';

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

export const cmsService = {
  // ── Hero Carousel ─────────────────────────────────────────────────────────
  listHeroSlides() {
    return adminFetch<HeroSlide[]>('/api/admin/cms/hero-carousel');
  },

  createHeroSlide(payload: HeroSlideFormPayload) {
    return adminFetch<HeroSlide>('/api/admin/cms/hero-carousel', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateHeroSlide(id: string, payload: Partial<HeroSlideFormPayload>) {
    return adminFetch<HeroSlide>(`/api/admin/cms/hero-carousel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteHeroSlide(id: string) {
    return adminFetch<null>(`/api/admin/cms/hero-carousel/${id}`, { method: 'DELETE' });
  },

  // ── CMS Pages ─────────────────────────────────────────────────────────────
  listPages() {
    return adminFetch<CmsPage[]>('/api/admin/cms/pages');
  },

  getPage(slug: string) {
    return adminFetch<CmsPage>(`/api/admin/cms/pages/${slug}`);
  },

  createPage(payload: CmsPageFormPayload) {
    return adminFetch<CmsPage>('/api/admin/cms/pages', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updatePage(slug: string, payload: Partial<CmsPageFormPayload>) {
    return adminFetch<CmsPage>(`/api/admin/cms/pages/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deletePage(slug: string) {
    return adminFetch<null>(`/api/admin/cms/pages/${slug}`, { method: 'DELETE' });
  },
};
