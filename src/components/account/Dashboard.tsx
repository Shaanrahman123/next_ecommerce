'use client';

import { Package, Heart, MapPin, CreditCard, TrendingUp, ShoppingBag, UserCircle, Star, Headphones, Bell, Lock, ChevronRight } from 'lucide-react';
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
        <div className="space-y-8 animate-fade-in">
            <div className="hidden lg:block">
                <h1 className="text-section-title font-black text-gray-900 mb-2 uppercase tracking-tight">Dashboard</h1>
                <p className="text-body text-gray-600">Welcome back! Manage your account and orders.</p>
            </div>

            {/* Navigation - Grid (2 per row on mobile, 2 per row on desktop) */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-6">
                {dashboardItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.label}
                            href={item.link}
                            className="bg-white border border-gray-300 rounded-lg p-4 lg:p-6 transition-all duration-300 group flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left lg:justify-between"
                        >
                            <div className="flex flex-col items-center lg:flex-row lg:items-center gap-3 lg:gap-5">
                                <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-md bg-gray-50 flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:bg-black group-hover:text-white shrink-0`}>
                                    <Icon className={`w-6 h-6 text-gray-900 group-hover:text-white transition-colors`} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] lg:text-body font-black text-gray-900 uppercase tracking-tight break-all">{item.label}</p>
                                    <p className="hidden lg:block text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Manage your {item.label.toLowerCase()}</p>
                                </div>
                            </div>
                            <ChevronRight className="hidden lg:block w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                        </Link>
                    );
                })}
            </div>

            {/* Recent Orders Section */}
            <div className="pt-4 lg:pt-0">
                <div className="flex items-center justify-between mb-6 lg:mb-8">
                    <h2 className="text-body font-black text-gray-900 uppercase tracking-widest border-l-4 border-black pl-3">Recent Orders</h2>
                    <Link
                        href="/account?section=orders"
                        className="text-[10px] font-black text-black hover:underline uppercase tracking-widest"
                    >
                        View All
                    </Link>
                </div>
                <div className="divide-y divide-gray-300 lg:space-y-4 lg:divide-y-0 text-full">
                    {recentOrders.map((order) => (
                        <div
                            key={order.id}
                            className="flex items-center justify-between py-5 lg:p-6 lg:bg-gray-50 lg:rounded-lg hover:bg-gray-100 transition-colors duration-300 group cursor-pointer px-4 lg:px-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center group-hover:bg-black transition-colors duration-500">
                                    <ShoppingBag className="w-6 h-6 text-black group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-small font-black text-gray-900 uppercase tracking-tighter">Order {order.id}</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{order.items} items • {order.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-small font-black text-gray-900 mb-1">{order.amount}</p>
                                <p className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${order.status === 'Delivered' ? 'text-green-600 bg-green-50 border-gray-300' : 'text-blue-600 bg-blue-50 border-gray-300'
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
