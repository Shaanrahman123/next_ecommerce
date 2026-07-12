'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Headphones, Plus, MessageCircle, ArrowLeft, Send, Loader2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ticketService } from '@/services/ticket.service';
import type { TicketSummary, TicketDetail } from '@/types/ticket';

export default function Support() {
    return (
        <Suspense fallback={<div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>}>
            <SupportContent />
        </Suspense>
    );
}

function SupportContent() {
    const searchParams = useSearchParams();
    const actionParam = searchParams.get('action');
    const orderIdParam = searchParams.get('orderId');

    const [tickets, setTickets] = useState<TicketSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // View state: 'list' | 'create' | 'detail'
    const [view, setView] = useState<'list' | 'create' | 'detail'>(actionParam === 'create' ? 'create' : 'list');
    const [activeTicket, setActiveTicket] = useState<TicketDetail | null>(null);

    const [formData, setFormData] = useState({
        subject: '',
        category: 'Order Issue',
        message: '',
        orderId: orderIdParam || '',
    });
    const [replyMessage, setReplyMessage] = useState('');

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await ticketService.listTickets();
            setTickets(res.data || []);
        } catch {
            setTickets([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await ticketService.createTicket({
                subject: formData.subject,
                category: formData.category,
                message: formData.message,
                orderId: formData.orderId || undefined,
            });
            setFormData({ subject: '', category: 'Order Issue', message: '', orderId: '' });
            setView('list');
            fetchTickets();
        } catch (error) {
            alert('Failed to create ticket');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenTicket = async (id: string) => {
        setView('detail');
        setIsLoading(true);
        try {
            const res = await ticketService.getTicket(id);
            setActiveTicket(res.data || null);
        } catch (error) {
            alert('Failed to load ticket details');
            setView('list');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeTicket || !replyMessage.trim()) return;
        setIsSubmitting(true);
        try {
            await ticketService.replyToTicket(activeTicket._id, { message: replyMessage });
            setReplyMessage('');
            // Refresh ticket details
            const res = await ticketService.getTicket(activeTicket._id);
            setActiveTicket(res.data || null);
        } catch (error) {
            alert('Failed to send reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
            case 'in-progress': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'resolved': return 'bg-green-50 text-green-600 border-green-200';
            case 'closed': return 'bg-gray-100 text-gray-500 border-gray-300';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    if (view === 'create') {
        return (
            <div className="animate-fade-in max-w-2xl mx-auto">
                <button onClick={() => setView('list')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-heading transition-colors mb-6">
                    <ArrowLeft className="w-3 h-3" /> Back to Tickets
                </button>
                <div className="bg-white border border-gray-300 rounded-lg p-6 lg:p-8">
                    <h2 className="text-body font-black text-heading mb-8 uppercase tracking-widest border-l-4 border-primary pl-3 flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Raise a New Ticket
                    </h2>
                    <form onSubmit={handleCreateSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                Category <span className="text-red-500 font-bold">*</span>
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-primary/5 transition-all duration-300 text-small font-bold text-heading appearance-none"
                            >
                                <option value="Order Issue">Order Issue</option>
                                <option value="Returns & Refunds">Returns & Refunds</option>
                                <option value="Payment">Payment</option>
                                <option value="Product Inquiry">Product Inquiry</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <Input
                            label="Subject"
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="Brief description of your issue"
                            required
                            className="bg-gray-50 border-none rounded-md h-14"
                        />
                        {formData.orderId && (
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                    Related Order
                                </label>
                                <Input
                                    label=""
                                    type="text"
                                    value={formData.orderId}
                                    disabled
                                    className="bg-gray-100 border-none rounded-md h-14 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                Message <span className="text-red-500 font-bold">*</span>
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Describe your issue in detail..."
                                required
                                rows={5}
                                className="w-full px-5 py-4 bg-gray-50 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-primary/5 transition-all duration-300 text-small"
                            />
                        </div>
                        <Button type="submit" isLoading={isSubmitting} className="w-full h-14 bg-primary text-on-primary rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-primary-hover transition-all">
                            Submit Ticket
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    if (view === 'detail' && activeTicket) {
        return (
            <div className="animate-fade-in max-w-3xl mx-auto h-[600px] flex flex-col bg-white border border-gray-300 rounded-lg overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('list')} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <ArrowLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(activeTicket.status)}`}>
                                    {activeTicket.status}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activeTicket.category}</span>
                            </div>
                            <h2 className="text-body font-black text-heading line-clamp-1">{activeTicket.subject}</h2>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50/30">
                    {activeTicket.messages.map((msg, idx) => {
                        const isUser = msg.sender === 'user';
                        return (
                            <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-4 ${isUser ? 'bg-primary text-on-primary rounded-tr-sm' : 'bg-white border border-gray-200 text-heading rounded-tl-sm'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                </div>
                                <span className="text-[9px] font-bold text-gray-400 mt-1.5 uppercase tracking-widest">
                                    {isUser ? 'You' : 'Support Team'} • {formatDateTime(msg.createdAt)}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {activeTicket.status !== 'closed' ? (
                    <form onSubmit={handleReplySubmit} className="p-4 border-t border-gray-200 bg-white flex gap-3 shrink-0">
                        <input
                            type="text"
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Type your reply..."
                            required
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:border-primary/50"
                        />
                        <Button type="submit" isLoading={isSubmitting} className="w-12 h-12 rounded-full p-0 flex items-center justify-center shrink-0">
                            <Send className="w-4 h-4 ml-0.5" />
                        </Button>
                    </form>
                ) : (
                    <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                        This ticket is closed
                    </div>
                )}
            </div>
        );
    }

    // Default List View
    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-section-title font-black text-heading mb-2 uppercase tracking-tight">Support</h1>
                    <p className="text-body text-gray-600">Get help with your orders and account</p>
                </div>
                <Button onClick={() => setView('create')} className="bg-primary text-on-primary rounded-md font-black uppercase tracking-widest text-[10px] px-6 h-12">
                    Open New Ticket
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            ) : tickets.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                        <Headphones className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-body font-black text-heading mb-1">No active tickets</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">You have no support history.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-300 rounded-lg overflow-hidden divide-y divide-gray-200">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket._id}
                            onClick={() => handleOpenTicket(ticket._id)}
                            className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                    <MessageCircle className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{ticket.category}</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-heading truncate pr-4">{ticket.subject}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                        {formatDate(ticket.updatedAt)} • {ticket.messageCount} Message{ticket.messageCount !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            <ArrowLeft className="w-4 h-4 text-gray-300 rotate-180 group-hover:text-heading shrink-0 transition-colors" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
