export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface TicketMessage {
  _id: string;
  sender: 'user' | 'admin';
  message: string;
  createdAt: string;
}

export interface TicketSummary {
  _id: string;
  orderId?: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface TicketDetail extends TicketSummary {
  messages: TicketMessage[];
}

export interface AdminTicketSummary extends TicketSummary {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface AdminTicketDetail extends TicketDetail {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateTicketPayload {
  subject: string;
  category: string;
  message: string;
  orderId?: string;
}

export interface TicketReplyPayload {
  message: string;
}
