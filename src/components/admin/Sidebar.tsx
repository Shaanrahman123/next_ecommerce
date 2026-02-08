'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    BarChart3,
    Settings,
    Menu,
    X,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Search,
    Bell
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Package, label: 'Products', href: '/admin/dashboard/products' },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/dashboard/orders' },
    { icon: Users, label: 'Customers', href: '/admin/dashboard/customers' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/dashboard/analytics' },
    { icon: Settings, label: 'Settings', href: '/admin/dashboard/settings' },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

    return (
        <>
            {/* Mobile Toggle Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={toggleMobileSidebar}
                    className="p-2 bg-black text-white rounded-xl shadow-lg"
                >
                    {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleMobileSidebar}
                        className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Content */}
            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed ? '80px' : '280px',
                    x: isMobileOpen ? 0 : (isMobileOpen ? 0 : undefined) // Mobile control
                }}
                className={`fixed top-0 left-0 h-full bg-white border-r border-gray-100 z-50 overflow-hidden transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                <div className="flex flex-col h-full py-6 px-4">
                    {/* Logo & Toggle */}
                    <div className="flex items-center justify-between mb-10 px-2">
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-bold text-xl tracking-tighter"
                            >
                                PREMIUM<span className="text-gray-400">ADMIN</span>
                            </motion.div>
                        )}
                        {isCollapsed && (
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mx-auto">
                                <span className="text-white text-[10px] font-bold">P</span>
                            </div>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors"
                        >
                            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 space-y-1.5">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center p-3 rounded-xl transition-all group relative
                    ${isActive
                                            ? 'bg-black text-white shadow-lg shadow-black/5'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                                        }
                  `}
                                >
                                    <item.icon className={`w-5 h-5 min-w-[20px] ${isActive ? 'text-white' : 'group-hover:text-black'}`} />
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="ml-3 font-medium whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                    {isCollapsed && (
                                        <div className="absolute left-16 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="mt-auto space-y-1.5 pt-6 border-t border-gray-50">
                        <button className="flex items-center w-full p-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-black transition-all group">
                            <LogOut className="w-5 h-5 min-w-[20px]" />
                            {!isCollapsed && <span className="ml-3 font-medium">Log out</span>}
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Layout Content wrapper adjustment */}
            <style jsx global>{`
        .admin-content-shifted {
          margin-left: ${isCollapsed ? '80px' : '280px'};
          transition: margin-left 0.3s ease-in-out;
        }
        @media (max-width: 1024px) {
          .admin-content-shifted {
            margin-left: 0;
          }
        }
      `}</style>
        </>
    );
}
