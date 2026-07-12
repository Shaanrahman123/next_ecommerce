'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Search, Headphones, X, Send, ChevronRight, User } from 'lucide-react';
import { ticketService } from '@/services/ticket.service';
import { orderService } from '@/services/order.service';
import type { AdminTicketSummary, AdminTicketDetail, TicketMessage } from '@/types/ticket';
import type { AdminOrderListItem } from '@/types/order';
import { formatINR } from '@/lib/shippingUtils';

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-red-50 text-red-700 border-red-200',
  'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
  resolved: 'bg-blue-50 text-blue-700 border-blue-200',
  closed: 'bg-gray-50 text-gray-700 border-gray-200',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-gray-500 bg-gray-100',
  medium: 'text-blue-600 bg-blue-100',
  high: 'text-red-600 bg-red-100',
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<AdminTicketSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<AdminTicketDetail | null>(null);
  const [relatedOrder, setRelatedOrder] = useState<AdminOrderListItem | null>(null);
  
  // Reply state
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await ticketService.adminListTickets(statusFilter);
      setTickets(res.data || []);
    } catch {
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const openTicket = async (id: string) => {
    try {
      const res = await ticketService.adminGetTicket(id);
      if (res.data) {
          setSelectedTicket(res.data);
          if (res.data.orderId) {
              try {
                  const orderRes = await orderService.admin.getOrder(res.data.orderId);
                  if (orderRes.data) setRelatedOrder(orderRes.data);
              } catch {
                  setRelatedOrder(null);
              }
          } else {
              setRelatedOrder(null);
          }
      }
    } catch {
      // ignore
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    
    setIsReplying(true);
    try {
      const res = await ticketService.adminReplyToTicket(selectedTicket._id, { message: replyMessage });
      if (res.data) {
        setSelectedTicket({
            ...selectedTicket,
            messages: [...selectedTicket.messages, res.data],
            status: selectedTicket.status === 'open' ? 'in-progress' : selectedTicket.status
        });
        setReplyMessage('');
        fetchTickets(); // Refresh list to update count/status
      }
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedTicket) return;
    setIsUpdatingStatus(true);
    try {
      await ticketService.adminUpdateTicket(selectedTicket._id, { status: newStatus });
      setSelectedTicket({ ...selectedTicket, status: newStatus as any });
      fetchTickets();
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading font-heading">Support Tickets</h1>
        <p className="text-gray-500">Manage customer inquiries and resolve issues.</p>
      </div>

      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none bg-white font-semibold"
        >
          <option value="all">All Tickets</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Headphones className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            No tickets found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Subject</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Priority</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    onClick={() => openTicket(ticket._id)}
                    className="hover:bg-gray-50/60 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                        <p className="text-sm font-bold text-heading">{ticket.user?.firstName} {ticket.user?.lastName}</p>
                        <p className="text-xs text-gray-400">{ticket.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-heading truncate max-w-[200px]">{ticket.subject}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{ticket.category} • {ticket.messageCount} msg{ticket.messageCount !== 1 && 's'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_COLORS[ticket.status]}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${PRIORITY_COLORS[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                      {new Date(ticket.updatedAt).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTicket(null)} />
          <div className="relative w-full max-w-3xl h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
            
            {/* Header */}
            <div className="p-5 lg:p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50 shrink-0">
              <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_COLORS[selectedTicket.status]}`}>
                        {selectedTicket.status}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{selectedTicket.category}</span>
                </div>
                <h2 className="text-lg lg:text-xl font-bold text-heading">{selectedTicket.subject}</h2>
                <div className="flex items-center gap-2 mt-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 font-medium">{selectedTicket.user?.firstName} {selectedTicket.user?.lastName}</span>
                    <span className="text-sm text-gray-400">({selectedTicket.user?.email})</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                    value={selectedTicket.status}
                    disabled={isUpdatingStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg outline-none cursor-pointer"
                >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>
                <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                    <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Order Details (if any) */}
            {relatedOrder && (
                <div className="p-4 border-b border-gray-100 bg-white shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase">Related Order: {relatedOrder.orderNumber}</h3>
                        <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase">{relatedOrder.status}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-xs mb-3">
                        <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <span className="text-gray-400">Date: </span>
                            <span className="font-semibold">{new Date(relatedOrder.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <span className="text-gray-400">Total: </span>
                            <span className="font-semibold text-primary">{formatINR(relatedOrder.total)}</span>
                        </div>
                        <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <span className="text-gray-400">Items: </span>
                            <span className="font-semibold">{relatedOrder.itemCount}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {relatedOrder.items.slice(0, 2).map(item => (
                            <div key={`${item.productId}-${item.size}`} className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                                <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden relative shrink-0">
                                    {/* Using an img tag to avoid importing next/image if missing or just use raw url */}
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-heading truncate">{item.name}</p>
                                    <p className="text-[10px] text-gray-500">Qty: {item.quantity} • {item.size} • {item.color}</p>
                                </div>
                                <div className="font-bold text-xs">
                                    {formatINR(item.lineTotal)}
                                </div>
                            </div>
                        ))}
                        {relatedOrder.items.length > 2 && (
                            <p className="text-[10px] text-center text-gray-400 font-bold uppercase mt-1">
                                + {relatedOrder.items.length - 2} more items
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-6 bg-[#fafafa]">
              {selectedTicket.messages.map((msg, i) => (
                <div key={i} className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-start' : 'self-end items-end ml-auto'}`}>
                    <span className="text-[10px] font-bold uppercase text-gray-400 mb-1 px-1">
                        {msg.sender === 'user' ? 'Customer' : 'Support Team'}
                    </span>
                    <div className={`p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm' : 'bg-primary text-white rounded-tr-sm shadow-md'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                        {new Date(msg.createdAt || selectedTicket.createdAt).toLocaleString('en-IN')}
                    </span>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            {selectedTicket.status !== 'closed' ? (
                <div className="p-4 lg:p-6 border-t border-gray-100 bg-white shrink-0">
                    <form onSubmit={handleReply} className="flex gap-3">
                        <textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Type your reply here..."
                            className="flex-1 resize-none h-20 p-3 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isReplying || !replyMessage.trim()}
                            className="px-6 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-1"
                        >
                            {isReplying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            <span className="text-[10px] uppercase tracking-wider">Reply</span>
                        </button>
                    </form>
                </div>
            ) : (
                <div className="p-4 bg-gray-50 text-center text-sm font-bold text-gray-500 uppercase tracking-widest border-t border-gray-100">
                    Ticket is closed
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
