import type { CreateTicketPayload, TicketReplyPayload, TicketSummary, TicketDetail, TicketMessage, AdminTicketSummary, AdminTicketDetail } from '@/types/ticket';

async function ticketFetch<T>(url: string, options: RequestInit = {}): Promise<{
  status: boolean;
  message: string;
  statusCode: number;
  data?: T;
}> {
  const config: RequestInit = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };
  let response = await fetch(url, config);
  if (response.status === 401) {
    const refreshed = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
    if (refreshed.ok) response = await fetch(url, config);
  }
  const result = await response.json();
  if (!result.status) {
    throw { message: result.message, statusCode: result.statusCode };
  }
  return result;
}

async function adminTicketFetch<T>(url: string, options: RequestInit = {}): Promise<{
  status: boolean;
  message: string;
  statusCode: number;
  data?: T;
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
  const result = await response.json();
  if (!result.status) {
    throw { message: result.message, statusCode: result.statusCode };
  }
  return result;
}

export const ticketService = {
  listTickets: async () => {
    return ticketFetch<TicketSummary[]>('/api/tickets', { method: 'GET' });
  },
  
  createTicket: async (payload: CreateTicketPayload) => {
    return ticketFetch<TicketSummary>('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getTicket: async (id: string) => {
    return ticketFetch<TicketDetail>(`/api/tickets/${id}`, { method: 'GET' });
  },

  replyToTicket: async (id: string, payload: TicketReplyPayload) => {
    return ticketFetch<TicketMessage>(`/api/tickets/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Admin Methods
  adminListTickets: async (status?: string) => {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return adminTicketFetch<AdminTicketSummary[]>(`/api/admin/tickets${query}`, { method: 'GET' });
  },

  adminGetTicket: async (id: string) => {
    return adminTicketFetch<AdminTicketDetail>(`/api/admin/tickets/${id}`, { method: 'GET' });
  },

  adminUpdateTicket: async (id: string, update: { status?: string; priority?: string }) => {
    return adminTicketFetch(`/api/admin/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(update),
    });
  },

  adminReplyToTicket: async (id: string, payload: TicketReplyPayload) => {
    return adminTicketFetch<TicketMessage>(`/api/admin/tickets/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
