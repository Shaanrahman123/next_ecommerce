'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { X, ShoppingBag, Headphones, AlertTriangle, Bell, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface NotificationData {
    newOrders: number;
    cancelledOrders: number;
    newTickets: number;
}

export function useAdminNotifications() {
    const [data, setData] = useState<NotificationData>({ newOrders: 0, cancelledOrders: 0, newTickets: 0 });
    const pathname = usePathname();

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`/api/admin/notifications?t=${Date.now()}`, { credentials: 'include', cache: 'no-store' });
            const json = await res.json();
            if (json.status && json.data) {
                setData(json.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (type: 'orders' | 'tickets') => {
        try {
            await fetch('/api/admin/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type }),
                credentials: 'include',
            });
            setData(prev => ({
                ...prev,
                newOrders: type === 'orders' ? 0 : prev.newOrders,
                cancelledOrders: type === 'orders' ? 0 : prev.cancelledOrders,
                newTickets: type === 'tickets' ? 0 : prev.newTickets,
            }));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (pathname.includes('/admin/dashboard/orders')) {
            if (data.newOrders > 0 || data.cancelledOrders > 0) markAsRead('orders');
        } else if (pathname.includes('/admin/dashboard/support')) {
            if (data.newTickets > 0) markAsRead('tickets');
        }
    }, [pathname, data]);

    return { data, markAsRead, refresh: fetchNotifications };
}

// Global state alternative using events since we fetch twice otherwise
let cachedData: NotificationData = { newOrders: 0, cancelledOrders: 0, newTickets: 0 };
const listeners = new Set<(d: NotificationData) => void>();
const updateListeners = (d: NotificationData) => { cachedData = d; listeners.forEach(l => l(d)); };

export function useSharedNotifications() {
    const [data, setData] = useState<NotificationData>(cachedData);
    const pathname = usePathname();

    useEffect(() => {
        listeners.add(setData);
        
        const fetchNotifications = async () => {
            try {
                const res = await fetch(`/api/admin/notifications?t=${Date.now()}`, { credentials: 'include', cache: 'no-store' });
                const json = await res.json();
                if (json.status && json.data) {
                    updateListeners(json.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchNotifications();

        return () => { listeners.delete(setData); };
    }, []);

    const markAsRead = async (type: 'orders' | 'tickets') => {
        try {
            await fetch('/api/admin/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type }),
                credentials: 'include',
            });
            updateListeners({
                ...cachedData,
                newOrders: type === 'orders' ? 0 : cachedData.newOrders,
                cancelledOrders: type === 'orders' ? 0 : cachedData.cancelledOrders,
                newTickets: type === 'tickets' ? 0 : cachedData.newTickets,
            });
        } catch (err) {
            console.error(err);
        }
    };

    // Removed auto-dismiss on page navigation
    // useEffect(() => { ... })

    return { data, markAsRead };
}

export function AdminNotifications() {
    const { data, markAsRead } = useSharedNotifications();
    const [dismissedLocally, setDismissedLocally] = useState<string[]>([]);
    const pathname = usePathname();

    const handleDismiss = async (type: 'orders' | 'cancelledOrders' | 'tickets') => {
        setDismissedLocally(prev => [...prev, type]);
        if (type === 'orders' || type === 'cancelledOrders') {
            await markAsRead('orders');
        } else if (type === 'tickets') {
            await markAsRead('tickets');
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
            {data.newOrders > 0 && !dismissedLocally.includes('orders') && (
                <div className="animate-fade-in-up bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl shadow-lg flex gap-3 relative pointer-events-auto">
                    <div className="bg-emerald-100 p-2 rounded-lg h-fit">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">New Order Received!</h4>
                        <p className="text-xs mt-1 text-emerald-700">You have {data.newOrders} unread order{data.newOrders > 1 ? 's' : ''}. Please check the orders page.</p>
                    </div>
                    <button onClick={() => handleDismiss('orders')} className="absolute top-2 right-2 p-1 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {data.cancelledOrders > 0 && !dismissedLocally.includes('cancelledOrders') && (
                <div className="animate-fade-in-up bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl shadow-lg flex gap-3 relative pointer-events-auto">
                    <div className="bg-red-100 p-2 rounded-lg h-fit">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Order Cancelled</h4>
                        <p className="text-xs mt-1 text-red-700">You have {data.cancelledOrders} new cancellation{data.cancelledOrders > 1 ? 's' : ''}.</p>
                    </div>
                    <button onClick={() => handleDismiss('cancelledOrders')} className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-100 rounded-md transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {data.newTickets > 0 && !dismissedLocally.includes('tickets') && (
                <div className="animate-fade-in-up bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl shadow-lg flex gap-3 relative pointer-events-auto">
                    <div className="bg-red-100 p-2 rounded-lg h-fit">
                        <Headphones className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">New Support Ticket</h4>
                        <p className="text-xs mt-1 text-red-700">You have {data.newTickets} unread support ticket{data.newTickets > 1 ? 's' : ''}.</p>
                    </div>
                    <button onClick={() => handleDismiss('tickets')} className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-100 rounded-md transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

export function NotificationDropdown() {
    const { data, markAsRead } = useSharedNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const totalCount = data.newOrders + data.cancelledOrders + data.newTickets;

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigate = async (path: string, type: 'orders' | 'tickets') => {
        setIsOpen(false);
        await markAsRead(type);
        router.push(path);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 text-gray-400 hover:text-heading hover:bg-gray-50 rounded-xl transition-all ${isOpen ? 'bg-gray-50 text-heading' : ''}`}
            >
                <Bell className="w-5 h-5" />
                {totalCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white">
                        {totalCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <h3 className="font-bold text-sm text-heading">Notifications</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{totalCount} Unread</span>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {totalCount === 0 ? (
                            <div className="p-8 text-center text-sm text-gray-400">
                                You have no new notifications.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {data.newOrders > 0 && (
                                    <button onClick={() => handleNavigate('/admin/dashboard/orders', 'orders')} className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start gap-3 group">
                                        <div className="bg-emerald-100 p-2 rounded-lg shrink-0 group-hover:bg-emerald-500 transition-colors">
                                            <ShoppingBag className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-heading">New Orders</p>
                                            <p className="text-xs text-gray-500 mt-0.5">You have {data.newOrders} new order{data.newOrders > 1 ? 's' : ''}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 self-center" />
                                    </button>
                                )}
                                
                                {data.cancelledOrders > 0 && (
                                    <button onClick={() => handleNavigate('/admin/dashboard/orders', 'orders')} className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start gap-3 group">
                                        <div className="bg-red-100 p-2 rounded-lg shrink-0 group-hover:bg-red-500 transition-colors">
                                            <AlertTriangle className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-heading">Cancelled Orders</p>
                                            <p className="text-xs text-gray-500 mt-0.5">You have {data.cancelledOrders} new cancellation{data.cancelledOrders > 1 ? 's' : ''}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 self-center" />
                                    </button>
                                )}

                                {data.newTickets > 0 && (
                                    <button onClick={() => handleNavigate('/admin/dashboard/support', 'tickets')} className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start gap-3 group">
                                        <div className="bg-blue-100 p-2 rounded-lg shrink-0 group-hover:bg-blue-500 transition-colors">
                                            <Headphones className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-heading">Support Tickets</p>
                                            <p className="text-xs text-gray-500 mt-0.5">You have {data.newTickets} new ticket{data.newTickets > 1 ? 's' : ''}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 self-center" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
