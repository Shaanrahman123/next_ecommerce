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
    ChevronDown,
    Layers,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuthActions } from '@/hooks/useAdminAuthActions';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    {
        icon: Package,
        label: 'Products',
        href: '/admin/dashboard/products',
        subItems: [
            { label: 'All Products', href: '/admin/dashboard/products' },
            { label: 'Add Product', href: '/admin/dashboard/products/add' },
            { label: 'Inventory', href: '/admin/dashboard/products/inventory' },
        ]
    },
    {
        icon: Layers,
        label: 'Categories',
        href: '/admin/dashboard/categories',
        subItems: [
            { label: 'Manage All', href: '/admin/dashboard/categories' },
            { label: 'Departments', href: '/admin/dashboard/categories?tab=departments' },
            { label: 'Category Groups', href: '/admin/dashboard/categories?tab=groups' },
            { label: 'Sub Categories', href: '/admin/dashboard/categories?tab=items' },
        ]
    },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/dashboard/orders' },
    { icon: Users, label: 'Customers', href: '/admin/dashboard/customers' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/dashboard/analytics' },
    { icon: Settings, label: 'Settings', href: '/admin/dashboard/settings' },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const pathname = usePathname();
    const { logout, isLoading: isLoggingOut } = useAdminAuthActions();

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

    const toggleMenu = (label: string) => {
        setOpenMenus(prev =>
            prev.includes(label)
                ? prev.filter(m => m !== label)
                : [...prev, label]
        );
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={toggleMobileSidebar}
                    className="p-2 bg-primary text-on-primary rounded-xl shadow-lg"
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
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
                                <span className="text-white text-[10px] font-bold">P</span>
                            </div>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-heading transition-colors"
                        >
                            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 space-y-1.5">
                        {sidebarItems.map((item) => {
                            // @ts-ignore
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            // @ts-ignore
                            const isSubActive = hasSubItems && item.subItems.some(sub => pathname === sub.href);
                            const isActive = pathname === item.href || isSubActive;
                            const isOpen = openMenus.includes(item.label);

                            return (
                                <div key={item.label}>
                                    {hasSubItems ? (
                                        <button
                                            onClick={() => toggleMenu(item.label)}
                                            className={`flex items-center w-full p-3 rounded-xl transition-all group relative
                                                ${isActive && !isOpen
                                                    ? 'bg-primary text-on-primary shadow-lg shadow-black/5'
                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-heading'
                                                }
                                            `}
                                        >
                                            <item.icon className={`w-5 h-5 min-w-[20px] ${isActive && !isOpen ? 'text-white' : 'group-hover:text-heading'}`} />
                                            {!isCollapsed && (
                                                <>
                                                    <span className="ml-3 font-medium whitespace-nowrap flex-1 text-left">
                                                        {item.label}
                                                    </span>
                                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center p-3 rounded-xl transition-all group relative
                                                ${isActive
                                                    ? 'bg-primary text-on-primary shadow-lg shadow-black/5'
                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-heading'
                                                }
                                            `}
                                        >
                                            <item.icon className={`w-5 h-5 min-w-[20px] ${isActive ? 'text-white' : 'group-hover:text-heading'}`} />
                                            {!isCollapsed && (
                                                <span className="ml-3 font-medium whitespace-nowrap">
                                                    {item.label}
                                                </span>
                                            )}
                                            {isCollapsed && (
                                                <div className="absolute left-16 px-2 py-1 bg-primary text-on-primary text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                                    {item.label}
                                                </div>
                                            )}
                                        </Link>
                                    )}

                                    {/* Sub Items */}
                                    <AnimatePresence>
                                        {hasSubItems && isOpen && !isCollapsed && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-1 ml-4 pl-4 border-l border-gray-100 space-y-1">
                                                    {/* @ts-ignore */}
                                                    {item.subItems.map((subItem) => {
                                                        const isActiveSub = pathname === subItem.href;
                                                        return (
                                                            <Link
                                                                key={subItem.href}
                                                                href={subItem.href}
                                                                onClick={() => setIsMobileOpen(false)}
                                                                className={`flex items-center p-2.5 rounded-lg text-sm transition-all
                                                                    ${isActiveSub
                                                                        ? 'text-heading font-semibold bg-gray-50'
                                                                        : 'text-gray-500 hover:text-heading hover:bg-gray-50'
                                                                    }
                                                                `}
                                                            >
                                                                {subItem.label}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="mt-auto space-y-1.5 pt-6 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={() => logout()}
                            disabled={isLoggingOut}
                            className="flex items-center w-full p-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-heading transition-all group disabled:opacity-50"
                        >
                            <LogOut className="w-5 h-5 min-w-[20px]" />
                            {!isCollapsed && (
                                <span className="ml-3 font-medium">{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                            )}
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
