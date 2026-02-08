'use client';

import { Bell, Package, Heart, Tag, AlertCircle } from 'lucide-react';

export default function Notifications() {
    const notifications = [
        {
            id: '1',
            type: 'order',
            icon: Package,
            title: 'Order Delivered',
            message: 'Your order #12345 has been delivered successfully',
            time: '2 hours ago',
            read: false,
        },
        {
            id: '2',
            type: 'wishlist',
            icon: Heart,
            title: 'Price Drop Alert',
            message: 'Item in your wishlist is now 20% off',
            time: '1 day ago',
            read: false,
        },
        {
            id: '3',
            type: 'promo',
            icon: Tag,
            title: 'Special Offer',
            message: 'Get 30% off on your next purchase',
            time: '2 days ago',
            read: true,
        },
        {
            id: '4',
            type: 'alert',
            icon: AlertCircle,
            title: 'Payment Reminder',
            message: 'Your order #12344 payment is pending',
            time: '3 days ago',
            read: true,
        },
    ];

    const getIconColor = (type: string) => {
        switch (type) {
            case 'order': return 'bg-blue-100 text-blue-600';
            case 'wishlist': return 'bg-red-100 text-red-600';
            case 'promo': return 'bg-green-100 text-green-600';
            case 'alert': return 'bg-yellow-100 text-yellow-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="hidden lg:flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-section-title font-black text-gray-900 mb-2 uppercase tracking-tight">Notifications</h1>
                    <p className="text-body text-gray-600">Stay updated with your account activity</p>
                </div>
                <button className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white border border-black rounded-md transition-all duration-300">
                    Mark all as read
                </button>
            </div>

            <div className="divide-y divide-gray-300 lg:space-y-4 lg:divide-y-0 text-full px-0 sm:px-0">
                {notifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                        <div
                            key={notification.id}
                            className={`flex items-start gap-4 py-5 lg:p-6 lg:rounded-lg lg:border transition-all duration-300 hover:bg-gray-50 group cursor-pointer ${notification.read
                                ? 'bg-white lg:border-gray-300'
                                : 'bg-gray-50/50 lg:bg-white lg:border-gray-300'
                                }`}
                        >
                            <div className={`p-3.5 rounded-md shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${getIconColor(notification.type)}`}>
                                <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className={`font-black uppercase tracking-tight ${notification.read ? 'text-gray-900' : 'text-black'}`}>{notification.title}</h3>
                                    {!notification.read && (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black text-[8px] font-black text-white uppercase tracking-widest">New</div>
                                    )}
                                </div>
                                <p className="text-small text-gray-600 mb-2 leading-relaxed">{notification.message}</p>
                                <div className="flex items-center gap-3">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{notification.time}</p>
                                    {!notification.read && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {
                notifications.length === 0 && (
                    <div className="text-center py-24 bg-gray-50 rounded-md border border-dashed border-gray-300">
                        <div className="w-20 h-20 bg-white rounded-md flex items-center justify-center mx-auto mb-6">
                            <Bell className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-body font-black text-gray-900 mb-2 uppercase tracking-tight">No notifications</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">You're all caught up!</p>
                    </div>
                )
            }

            <div className="mt-8 lg:hidden">
                <button className="w-full py-5 bg-white border border-gray-300 text-black rounded-md font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all">
                    Mark all as read
                </button>
            </div>
        </div >
    );
}
