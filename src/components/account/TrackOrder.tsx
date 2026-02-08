import { Package, Search, ChevronRight, Check, MapPin, Truck, Box, Home, Phone, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useState } from 'react';

interface TrackOrderProps {
    orderId: string | null;
}

const trackingSteps = [
    {
        title: 'Order Placed',
        description: 'Your premium selection has been reserved.',
        date: 'Jan 28, 2024 - 10:30 AM',
        icon: Box,
        status: 'completed'
    },
    {
        title: 'Processing',
        description: 'Quality checks and premium packaging in progress.',
        date: 'Jan 29, 2024 - 02:15 PM',
        icon: Package,
        status: 'completed'
    },
    {
        title: 'Shipped',
        description: 'On its way via premium express courier.',
        date: 'Jan 31, 2024 - 09:00 AM',
        icon: Truck,
        status: 'completed'
    },
    {
        title: 'Delivered',
        description: 'Package received and signed by recipient.',
        date: 'Feb 02, 2024 - 04:30 PM',
        icon: Home,
        status: 'current'
    }
];

export default function TrackOrder({ orderId: initialOrderId }: TrackOrderProps) {
    const [orderId, setOrderId] = useState(initialOrderId || '');
    const [searching, setSearching] = useState(!!initialOrderId);

    if (searching && orderId) {
        return (
            <div className="animate-fade-in">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-black rounded-md flex items-center justify-center text-white shrink-0">
                            <Truck className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-section-title font-black text-gray-900 uppercase tracking-tight">Track Package</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {orderId}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSearching(false)}
                        className="flex items-center justify-center gap-2 h-11 px-6 border border-gray-300 rounded-md text-[10px] font-black text-gray-900 hover:bg-black hover:text-white transition-all uppercase tracking-widest"
                    >
                        <Search className="w-3.5 h-3.5" />
                        New Search
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Timeline */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white border border-gray-300 rounded-lg p-8 lg:p-12">
                            <div className="relative space-y-12">
                                {/* Vertical Line */}
                                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100" />

                                {trackingSteps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isCompleted = step.status === 'completed';
                                    const isCurrent = step.status === 'current';

                                    return (
                                        <div key={index} className="relative flex gap-8 group">
                                            {/* Step Marker */}
                                            <div className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 shrink-0 ${isCompleted ? 'bg-black border-black text-white' :
                                                isCurrent ? 'bg-white border-black text-black scale-110 shadow-lg' :
                                                    'bg-white border-gray-200 text-gray-300'
                                                }`}>
                                                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 pt-1">
                                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-2">
                                                    <h3 className={`text-body font-black uppercase tracking-tight ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-300'}`}>
                                                        {step.title}
                                                    </h3>
                                                    <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${isCurrent ? 'text-black' : 'text-gray-400'}`}>
                                                        {step.date}
                                                    </span>
                                                </div>
                                                <p className={`text-[11px] font-bold leading-relaxed uppercase tracking-wider ${isCompleted || isCurrent ? 'text-gray-500' : 'text-gray-300'}`}>
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-300 rounded-lg p-6 lg:p-8 shadow-none">
                            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center text-white shrink-0">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                Delivery Address
                            </h3>
                            <div className="space-y-1">
                                <p className="text-body font-black text-gray-900 uppercase tracking-tight">John Doe</p>
                                <p className="text-small font-bold text-gray-500 uppercase tracking-tight leading-relaxed">123 Main Street</p>
                                <p className="text-small font-bold text-gray-500 uppercase tracking-tight leading-relaxed">Apartment 4B</p>
                                <p className="text-small font-bold text-gray-500 uppercase tracking-tight leading-relaxed">New York, NY 10001</p>
                                <div className="pt-4 mt-4 border-t border-gray-300 space-y-2">
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <Phone className="w-3.5 h-3.5" />
                                        +1 (555) 123-4567
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <Mail className="w-3.5 h-3.5" />
                                        john.doe@example.com
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-300 rounded-lg p-6">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Need Assistance?</p>
                            <Button fullWidth variant="outline" className="h-12 border-gray-300 rounded-md text-[10px] font-black uppercase tracking-widest shadow-none flex items-center justify-center text-center leading-none">
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </div>
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
                    <input
                        type="text"
                        placeholder="Order ID (e.g. 12345678)"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="w-full h-16 bg-gray-50 border border-gray-100 rounded-md px-8 text-body font-black focus:ring-2 focus:ring-black focus:bg-white transition-all outline-hidden"
                    />
                    <Button
                        fullWidth
                        className="rounded-md h-16 font-black uppercase tracking-widest bg-black text-white hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-none border-none"
                        onClick={() => setSearching(true)}
                    >
                        Locate Package
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>

                <div className="mt-12 p-6 bg-gray-50 rounded-md inline-block max-w-xs mx-auto">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                        Order ID is in your confirmation email
                    </p>
                </div>
            </div>
        </div>
    );
}
