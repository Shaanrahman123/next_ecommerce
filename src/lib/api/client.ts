import { ApiError, ApiResponse } from '@/types/api';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  skipRefresh?: boolean;
};

class ApiClient {
  private refreshPromise: Promise<boolean> | null = null;

  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    return data as ApiResponse<T>;
  }

  async refreshSession(): Promise<boolean> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });
        const data = await response.json();
        return response.ok && data.status;
      } catch {
        return false;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async request<T = unknown>(
    url: string,
    options: RequestOptions = {}
  ): Promise<{ data: ApiResponse<T>; response: Response }> {
    const { body, skipRefresh, headers, ...rest } = options;

    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...rest,
    };

    if (body !== undefined) {
      config.body = JSON.stringify(body);
    }

    let response = await fetch(url, config);
    let data = await this.parseResponse<T>(response);

    if (
      response.status === 401 &&
      !skipRefresh &&
      !url.includes('/api/auth/refresh') &&
      !url.includes('/api/auth/login') &&
      !url.includes('/api/auth/sign-up')
    ) {
      const refreshed = await this.refreshSession();
      if (refreshed) {
        response = await fetch(url, config);
        data = await this.parseResponse<T>(response);
      }
    }

    return { data, response };
  }

  async post<T = unknown>(url: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(url, { ...options, method: 'POST', body });
  }

  async get<T = unknown>(url: string, options?: RequestOptions) {
    return this.request<T>(url, { ...options, method: 'GET' });
  }
}

export const apiClient = new ApiClient();

export function throwIfError<T>(data: ApiResponse<T>, response: Response): T | undefined {
  if (!response.ok || !data.status) {
    const error: ApiError = {
      message: data.message || 'Something went wrong',
      statusCode: data.statusCode || response.status,
    };
    throw error;
  }
  return data.data;
}

export function getAuthErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as ApiError).message);
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
