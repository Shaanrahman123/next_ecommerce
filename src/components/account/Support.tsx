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
        <div className="space-y-8">
            <div>
                <h1 className="text-page-title text-gray-900 mb-2">Support</h1>
                <p className="text-gray-600">Get help with your orders and account</p>
            </div>

            {/* Create Ticket */}
            <div className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Raise a New Ticket
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief description of your issue"
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Describe your issue in detail..."
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                        />
                    </div>
                    <Button type="submit" isLoading={isLoading}>
                        Submit Ticket
                    </Button>
                </form>
            </div>

            {/* Existing Tickets */}
            <div>
                <h2 className="text-section-title font-bold text-gray-900 mb-6">Your Tickets</h2>
                <div className="space-y-4">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <MessageCircle className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{ticket.id} - {ticket.subject}</p>
                                    <p className="text-sm text-gray-500">{ticket.date}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                }`}>
                                {ticket.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
