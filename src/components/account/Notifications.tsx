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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
                    <p className="text-gray-600">Stay updated with your account activity</p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 rounded-lg transition-colors duration-300">
                    Mark all as read
                </button>
            </div>

            <div className="space-y-3">
                {notifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                        <div
                            key={notification.id}
                            className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${notification.read
                                    ? 'bg-white border-gray-200'
                                    : 'bg-blue-50 border-blue-200'
                                }`}
                        >
                            <div className={`p-3 rounded-lg ${getIconColor(notification.type)}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                    {!notification.read && (
                                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5" />
                                    )}
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                                <p className="text-xs text-gray-500">{notification.time}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {notifications.length === 0 && (
                <div className="text-center py-16">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
                    <p className="text-gray-600">You're all caught up!</p>
                </div>
            )}
        </div>
    );
}
