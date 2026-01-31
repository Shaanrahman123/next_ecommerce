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
    user: any;
    onLogout: () => void;
}

export default function MobileSidebar({ isOpen, onClose, isAuthenticated, user, onLogout }: MobileSidebarProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const toggleCategory = (category: string) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 z-60 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-70 transform transition-transform duration-300 ease-out overflow-y-auto scrollbar-hide shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Header / Banner Area matching Minimal theme */}
                <div className="relative h-40 bg-black overflow-hidden">
                    {/* Decorative abstract shapes */}
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 rounded-full bg-gray-800/50 blur-xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 rounded-full bg-gray-900/50 blur-lg"></div>

                    <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-lg">
                            <span className="text-black font-bold text-xl">M</span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight mb-1">Welcome</h2>
                        <p className="text-gray-300 text-sm font-medium">Discover premium fashion</p>

                        {!isAuthenticated ? (
                            <div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                <Link href="/login" className="hover:underline" onClick={onClose}>Sign Up</Link>
                                <span>•</span>
                                <Link href="/login" className="hover:underline" onClick={onClose}>Login</Link>
                            </div>
                        ) : (
                            <div className="mt-3 text-xs font-bold uppercase tracking-wider">
                                {user?.name || 'User'}
                            </div>
                        )}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Categories Section */}
                <div className="py-4">
                    {mainNavigation.map((category) => (
                        <div key={category.id} className="border-b border-gray-50 last:border-0">
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex items-center justify-between px-6 py-4 text-gray-800 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`text-[15px] font-semibold ${expandedCategory === category.id ? 'text-black' : ''}`}>
                                        {category.label}
                                    </span>
                                </div>
                                {expandedCategory === category.id ? (
                                    <ChevronDown size={18} className="text-black" />
                                ) : (
                                    <ChevronRight size={18} className="text-gray-400" />
                                )}
                            </button>

                            {/* Expanded Content */}
                            <div
                                className={`overflow-hidden transition-all duration-300 bg-gray-50/50 ${expandedCategory === category.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-6 py-2 space-y-1">
                                    {category.items.map((item) => (
                                        <div key={item.slug} className="py-1">
                                            <Link
                                                href={`${category.basePath}&item=${item.slug}`}
                                                className="flex items-center gap-3 py-2 group"
                                                onClick={onClose}
                                            >
                                                {/* Small thumbnail for mobile menu - premium feel */}
                                                <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-200 shrink-0">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="40px"
                                                    />
                                                </div>
                                                <span className="text-gray-600 text-sm font-medium group-hover:text-black transition-colors">
                                                    {item.name}
                                                </span>
                                            </Link>
                                        </div>
                                    ))}
                                    <Link
                                        href={category.basePath}
                                        className="block text-black text-sm font-bold py-3 mt-2 border-t border-gray-200 hover:underline"
                                        onClick={onClose}
                                    >
                                        View All {category.label}
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
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Support</h3>
                            <div className="space-y-4">
                                <Link href="/contact" className="flex items-center gap-3 text-gray-600 hover:text-black" onClick={onClose}>
                                    <HelpCircle size={18} />
                                    <span className="text-sm">Contact Us</span>
                                </Link>
                                <Link href="/faq" className="flex items-center gap-3 text-gray-600 hover:text-black" onClick={onClose}>
                                    <HelpCircle size={18} />
                                    <span className="text-sm">FAQs</span>
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Legal</h3>
                            <div className="space-y-4">
                                <Link href="/terms" className="block text-sm text-gray-600 hover:text-black" onClick={onClose}>Terms of Use</Link>
                                <Link href="/privacy" className="block text-sm text-gray-600 hover:text-black" onClick={onClose}>Privacy Policy</Link>
                            </div>
                        </div>
                    </div>

                    {isAuthenticated && (
                        <div className="mt-8 px-6">
                            <button
                                onClick={() => { onLogout(); onClose(); }}
                                className="w-full py-3 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
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
