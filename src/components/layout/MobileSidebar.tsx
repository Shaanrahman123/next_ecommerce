'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronRight, ChevronDown, HelpCircle } from 'lucide-react';
import { mainNavigation } from '@/data/categories';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isAuthenticated: boolean;
    user: { name?: string; email?: string } | null;
    onLogout: () => void;
    navigation?: Array<{
        id: string;
        label: string;
        basePath: string;
        sections: Array<{
            title: string;
            basePath: string;
            items: Array<{ name: string; slug: string; image: string }>;
        }>;
    }>;
}

export default function MobileSidebar({ isOpen, onClose, isAuthenticated, user, onLogout, navigation: navProp }: MobileSidebarProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const navigation = navProp || mainNavigation.filter((n) => n.id !== 'sale');

    const toggleCategory = (category: string) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 z-[110] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[120] transform transition-transform duration-300 ease-out overflow-y-auto scrollbar-hide shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Header — premium redesign */}
                <div className="relative bg-gradient-to-br from-[#1a1209] via-[#2c1f0e] to-[#1a1209] overflow-hidden">
                    {/* Decorative blobs */}
                    <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-amber-600/20 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 z-10 p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-all backdrop-blur-sm"
                        aria-label="Close menu"
                    >
                        <X size={16} />
                    </button>

                    <div className="relative px-5 pt-5 pb-6">
                        {/* Brand name */}
                        <Link href="/" onClick={onClose} className="inline-block mb-5">
                            <span className="text-xs font-black tracking-[0.3em] text-amber-400/80 uppercase">Blak Blaze</span>
                        </Link>

                        {isAuthenticated ? (
                            /* Authenticated user panel */
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-900/40 shrink-0">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white font-bold text-base leading-tight truncate">
                                        {user?.name || 'User'}
                                    </p>
                                    <p className="text-amber-300/70 text-xs mt-0.5 truncate">
                                        {user?.email || 'Member'}
                                    </p>
                                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold tracking-wide border border-amber-500/20">
                                        Premium Member
                                    </span>
                                </div>
                            </div>
                        ) : (
                            /* Guest panel */
                            <div>
                                <h2 className="text-white text-xl font-bold tracking-tight leading-snug">
                                    Welcome to<br />
                                    <span className="text-amber-400">Blak Blaze</span>
                                </h2>
                                <p className="text-white/50 text-xs mt-1.5 mb-4">Discover premium fashion</p>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href="/login"
                                        onClick={onClose}
                                        className="flex-1 text-center py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/login"
                                        onClick={onClose}
                                        className="flex-1 text-center py-2 rounded-lg border border-white/20 hover:border-amber-400/60 text-white/80 hover:text-amber-300 text-xs font-bold transition-colors"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Categories Section */}
                <div className="py-4">
                    {navigation.map((category) => (
                        <div key={category.id} className="border-b border-gray-50 last:border-0">
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex items-center justify-between px-6 py-4 text-gray-800 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`text-[15px] font-semibold ${expandedCategory === category.id ? 'text-heading' : ''}`}>
                                        {category.label}
                                    </span>
                                </div>
                                {expandedCategory === category.id ? (
                                    <ChevronDown size={18} className="text-heading" />
                                ) : (
                                    <ChevronRight size={18} className="text-gray-400" />
                                )}
                            </button>

                            {/* Expanded Content */}
                            <div
                                className={`overflow-hidden transition-all duration-300 bg-gray-50/50 ${expandedCategory === category.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-6 py-4 space-y-6">
                                    {category.sections.map((section, sidx) => (
                                        <div key={sidx} className="space-y-3">
                                            <h4 className="text-xs font-bold text-gray-400 capitalize">
                                                {section.title}
                                            </h4>
                                            <div className="space-y-2">
                                                {section.items.map((item) => (
                                                    <Link
                                                        key={item.slug}
                                                        href={`${section.basePath}&item=${item.slug}`}
                                                        className="flex items-center gap-3 py-1.5 group"
                                                        onClick={onClose}
                                                    >
                                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover"
                                                                sizes="40px"
                                                            />
                                                        </div>
                                                        <span className="text-gray-600 text-[14px] font-semibold group-hover:text-heading transition-colors">
                                                            {item.name}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <Link
                                        href={category.basePath}
                                        className="text-heading text-xs font-bold py-4 mt-6 border-t border-gray-200 hover:gap-2 flex items-center gap-1 transition-all"
                                        onClick={onClose}
                                    >
                                        Explore All {category.label}
                                        <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Links */}
                <div className="border-t border-gray-100 bg-gray-50 pb-20 pt-4">
                    <div className="px-6 space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 capitalize mb-4">Support</h3>
                            <div className="space-y-4">
                                <Link href="/contact" className="flex items-center gap-3 text-gray-600 hover:text-heading" onClick={onClose}>
                                    <HelpCircle size={18} />
                                    <span className="text-sm">Contact Us</span>
                                </Link>
                                <Link href="/faq" className="flex items-center gap-3 text-gray-600 hover:text-heading" onClick={onClose}>
                                    <HelpCircle size={18} />
                                    <span className="text-sm">FAQs</span>
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 capitalize mb-4">Legal</h3>
                            <div className="space-y-4">
                                <Link href="/terms" className="block text-sm text-gray-600 hover:text-heading" onClick={onClose}>Terms of Use</Link>
                                <Link href="/privacy" className="block text-sm text-gray-600 hover:text-heading" onClick={onClose}>Privacy Policy</Link>
                            </div>
                        </div>
                    </div>

                    {isAuthenticated && (
                        <div className="mt-8 px-6">
                            <button
                                onClick={() => { onLogout(); onClose(); }}
                                className="w-full py-3 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-heading transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
