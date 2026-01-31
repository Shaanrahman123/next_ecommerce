'use client';

import { Package, Heart, MapPin, CreditCard, TrendingUp, ShoppingBag, UserCircle, Star, Headphones, Bell, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    // Navigation cards for the dashboard (replacing simple stats)
    const dashboardItems = [
        { label: 'My Orders', icon: Package, color: 'blue', link: '/account?section=orders' },
        { label: 'My Wishlist', icon: Heart, color: 'red', link: '/wishlist' },
        { label: 'My Addresses', icon: MapPin, color: 'green', link: '/account?section=addresses' },
        { label: 'My Profile', icon: UserCircle, color: 'purple', link: '/account?section=profile' },
        { label: 'Change Password', icon: Lock, color: 'orange', link: '/account?section=password' },
        { label: 'My Reviews', icon: Star, color: 'yellow', link: '/account?section=reviews' },
        { label: 'Support', icon: Headphones, color: 'cyan', link: '/account?section=support' },
        { label: 'Notifications', icon: Bell, color: 'indigo', link: '/account?section=notifications' },
    ];

    const recentOrders = [
        { id: '#12345', date: '2 days ago', status: 'Delivered', amount: '$129.99', items: 3 },
        { id: '#12344', date: '1 week ago', status: 'In Transit', amount: '$89.99', items: 2 },
        { id: '#12343', date: '2 weeks ago', status: 'Delivered', amount: '$199.99', items: 5 },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-page-title text-gray-900 mb-2">Dashboard</h1>
                <p className="text-body text-gray-600">Welcome back! Manage your account and orders.</p>
            </div>

            {/* Navigation Grid - 2 columns on mobile/desktop as requested */}
            <div className="grid grid-cols-2 gap-4">
                {dashboardItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.label}
                            href={item.link}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 group flex flex-row items-center gap-4"
                        >
                            <div className="group-hover:scale-110 transition-transform duration-300">
                                <Icon className={`w-6 h-6 text-${item.color}-600`} />
                            </div>
                            <p className="text-body font-semibold text-gray-900 text-left">{item.label}</p>
                        </Link>
                    );
                })}
            </div>

            {/* Recent Orders Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-section-title text-gray-900">Recent Orders</h2>
                    <Link
                        href="/account?section=orders"
                        className="text-body font-semibold text-black hover:underline"
                    >
                        View All
                    </Link>
                </div>
                <div className="space-y-4">
                    {recentOrders.map((order) => (
                        <div
                            key={order.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                                    <ShoppingBag className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-card-title text-gray-900">{order.id}</p>
                                    <p className="text-small text-gray-600">{order.items} items • {order.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-card-title text-gray-900">{order.amount}</p>
                                <p className={`text-small ${order.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'
                                    }`}>
                                    {order.status}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
