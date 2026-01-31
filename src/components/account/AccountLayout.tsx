'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import Link from 'next/link';
import {
    LayoutDashboard,
    UserCircle,
    Edit3,
    Lock,
    Package,
    MapPin,
    Star,
    Wallet,
    Headphones,
    Bell,
    LogOut,
    Menu,
    X
} from 'lucide-react';

interface AccountLayoutProps {
    children: React.ReactNode;
    currentSection: string;
}

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/account' },
    { id: 'profile', label: 'My Profile', icon: UserCircle, href: '/account?section=profile' },
    { id: 'edit-profile', label: 'Edit Profile', icon: Edit3, href: '/account?section=edit-profile' },
    { id: 'password', label: 'Change Password', icon: Lock, href: '/account?section=password' },
    { id: 'orders', label: 'My Orders', icon: Package, href: '/account?section=orders' },
    { id: 'addresses', label: 'My Addresses', icon: MapPin, href: '/account?section=addresses' },
    { id: 'reviews', label: 'My Reviews', icon: Star, href: '/account?section=reviews' },
    // { id: 'wallet', label: 'My Wallet', icon: Wallet, href: '/account?section=wallet' }, // Commented out - not needed for now
    { id: 'support', label: 'Support', icon: Headphones, href: '/account?section=support' },
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/account?section=notifications' },
];

export default function AccountLayout({ children, currentSection }: AccountLayoutProps) {
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router, mounted]);

    if (!mounted || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Hidden on mobile as per request */}
            <div className="hidden bg-white border-b border-gray-200 sticky top-0 lg:top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden text-gray-700 hover:text-black transition-colors"
                            >
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-center text-white font-semibold text-sm">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {user?.name || 'User'}
                                    </h2>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Sidebar - Hidden on mobile, as per user request (replaced by Dashboard cards) */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentSection === item.id || (currentSection === 'dashboard' && item.id === 'dashboard');
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                                            ${isActive
                                                ? 'bg-black text-white shadow-md'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </aside>



                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
