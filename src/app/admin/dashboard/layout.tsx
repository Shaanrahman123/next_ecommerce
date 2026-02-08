'use client';

import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { Search, Bell, User } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Sidebar />
            <div className="admin-content-shifted min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-bold text-black lg:block hidden">Dashboard</h2>
                    </div>

                    <div className="flex items-center space-x-3 lg:space-x-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search analytics..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-black outline-none transition-all w-64"
                            />
                        </div>

                        <button className="relative p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center space-x-3 pl-2 lg:pl-6 border-l border-gray-100">
                            <div className="hidden text-right lg:block">
                                <p className="text-sm font-bold text-black">John Admin</p>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
                                <User className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
