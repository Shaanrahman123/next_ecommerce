'use client';

import { useState } from 'react';
import { Headphones, Plus, MessageCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Support() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
    });

    const tickets = [
        { id: '#T12345', subject: 'Order delivery issue', status: 'Open', date: 'Dec 15, 2025' },
        { id: '#T12344', subject: 'Product quality concern', status: 'Resolved', date: 'Dec 10, 2025' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert('Ticket created successfully!');
            setFormData({ subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className="animate-fade-in">
            <div className="hidden lg:block mb-10">
                <h1 className="text-section-title font-black text-gray-900 mb-2 uppercase tracking-tight">Support</h1>
                <p className="text-body text-gray-600">Get help with your orders and account</p>
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-12">
                {/* Create Ticket */}
                <div className="lg:bg-white lg:border lg:border-gray-300 lg:rounded-lg lg:p-8 h-fit">
                    <h2 className="text-body font-black text-gray-900 mb-8 uppercase tracking-widest border-l-4 border-black pl-3 flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Raise a New Ticket
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Subject"
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="Brief description of your issue"
                            required
                            className="bg-gray-50 border-none rounded-md h-14"
                        />
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
                                className="w-full px-5 py-4 bg-gray-50 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 transition-all duration-300 text-small"
                            />
                        </div>
                        <Button type="submit" isLoading={isLoading} className="w-full h-14 bg-black text-white rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 transition-all">
                            Submit Ticket
                        </Button>
                    </form>
                </div>

                {/* Existing Tickets */}
                <div className="mt-12 lg:mt-0">
                    <h2 className="text-body font-black text-gray-900 mb-8 uppercase tracking-widest border-l-4 border-black pl-3">Your Tickets</h2>
                    <div className="divide-y divide-gray-300 lg:space-y-4 lg:divide-y-0">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="flex items-center justify-between py-5 lg:p-6 lg:bg-white lg:border lg:border-gray-300 lg:rounded-lg hover:bg-gray-50 transition-all duration-300 group cursor-pointer"
                            >
                                <div className="flex items-center gap-4 lg:gap-5">
                                    <div className="w-12 h-12 bg-gray-50 rounded-md flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-black group-hover:text-white">
                                        <MessageCircle className="w-5 h-5 text-gray-900 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-small font-black text-gray-900 uppercase tracking-tight">{ticket.id}</p>
                                        <p className="text-body font-bold text-gray-900 mt-0.5 line-clamp-1">{ticket.subject}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{ticket.date}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 ${ticket.status === 'Open' ? 'bg-yellow-50 text-yellow-600 border-gray-300' : 'bg-green-50 text-green-600 border-gray-300'
                                    }`}>
                                    {ticket.status}
                                </span>
                            </div>
                        ))}
                    </div>

                    {tickets.length === 0 && (
                        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center mx-auto mb-4">
                                <Headphones className="w-8 h-8 text-gray-200" />
                            </div>
                            <p className="text-small font-black text-gray-400 uppercase tracking-widest">No active tickets</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
