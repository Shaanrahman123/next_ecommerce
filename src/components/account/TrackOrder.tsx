'use client';

import { Package, Search, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import OrderDetails from './OrderDetails';

interface TrackOrderProps {
    orderId: string | null;
}

export default function TrackOrder({ orderId: initialOrderId }: TrackOrderProps) {
    const [orderId, setOrderId] = useState(initialOrderId || '');
    const [searching, setSearching] = useState(!!initialOrderId);

    if (searching && orderId) {
        return (
            <div>
                <button
                    onClick={() => setSearching(false)}
                    className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest mb-8"
                >
                    <Search className="w-3 h-3" />
                    SEARCH ANOTHER ORDER
                </button>
                <OrderDetails orderId={orderId} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in lg:bg-white lg:border lg:border-gray-300 lg:rounded-lg lg:p-12">
            <div className="max-w-2xl mx-auto text-center py-10 lg:py-0">
                <div className="relative inline-block mb-10 group">
                    <div className="w-24 h-24 bg-black rounded-md flex items-center justify-center mx-auto text-white transition-transform duration-500 group-hover:rotate-6">
                        <Package className="w-10 h-10" />
                    </div>
                </div>
                <h1 className="text-section-title font-black text-gray-900 mb-4 uppercase tracking-tight">Track Your Order</h1>
                <p className="text-body text-gray-500 mb-12 max-w-md mx-auto leading-relaxed">
                    Enter your order ID below to see exactly where your premium items are in real-time.
                </p>

                <div className="space-y-4 max-w-md mx-auto">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Order ID (e.g. 12345678)"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full h-16 bg-gray-50 border-none rounded-md px-8 text-body font-black focus:ring-2 focus:ring-black/5 transition-all outline-hidden"
                        />
                    </div>
                    <Button
                        fullWidth
                        size="lg"
                        className="rounded-md h-16 font-black uppercase tracking-widest bg-black text-white hover:bg-gray-900 transition-all flex items-center justify-center gap-3"
                        onClick={() => setSearching(true)}
                    >
                        Locate Package
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>

                <div className="mt-12 p-6 bg-gray-50 rounded-md inline-block max-w-xs mx-auto">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                        Order ID is in your confirmation email
                    </p>
                </div>
            </div>
        </div>
    );
}
