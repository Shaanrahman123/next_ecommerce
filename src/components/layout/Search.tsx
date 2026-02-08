'use client';

import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, ArrowLeft } from 'lucide-react';
import { mockProducts } from '@/data/products';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchProps {
    variant?: 'desktop' | 'overlay';
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Search({ variant = 'desktop', isOpen, onClose }: SearchProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (query.trim()) {
            const filtered = mockProducts.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 8);
            setSuggestions(filtered);
            setIsDropdownOpen(true);
        } else {
            setSuggestions([]);
            setIsDropdownOpen(false);
        }
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => mobileInputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query)}`);
            onClose?.();
            setIsDropdownOpen(false);
        }
    };

    if (variant === 'desktop') {
        return (
            <div className="hidden lg:relative lg:block flex-1 max-w-xl mx-8 group" ref={dropdownRef}>
                <form onSubmit={handleSearch} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for products, brands and more"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none! focus:ring-0! focus:bg-white focus:border-gray-300 transition-all text-xs"
                        onFocus={() => query && setIsDropdownOpen(true)}
                    />
                </form>

                {isDropdownOpen && suggestions.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full bg-white shadow-2xl rounded-md border border-gray-100 overflow-hidden animate-scale-in">
                        <div className="py-2">
                            {suggestions.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/products/${item.id}`}
                                    className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <div className="w-10 h-10 bg-gray-100 rounded mr-3 overflow-hidden shrink-0">
                                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[13px] font-semibold text-gray-900 truncate">{item.name}</div>
                                        <div className="text-[12px] text-gray-500">{item.category}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (variant === 'overlay' && isOpen) {
        return (
            <div className="fixed inset-0 z-[100] bg-white animate-slide-up flex flex-col">
                <div className="flex items-center p-4 gap-3">
                    <button onClick={onClose} className="text-gray-900">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <input
                            ref={mobileInputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for brands and products"
                            className="w-full py-2 px-4 border border-black rounded-sm focus:outline-none! focus:ring-0! text-sm placeholder-gray-400 font-medium"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500">
                            <SearchIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {query ? (
                        <div className="bg-white px-2">
                            {suggestions.length > 0 ? (
                                suggestions.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/products/${item.id}`}
                                        className="flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50 transition-colors"
                                        onClick={onClose}
                                    >
                                        <div className="flex items-center min-w-0">
                                            <SearchIcon className="w-4 h-4 text-gray-300 mr-4 shrink-0" />
                                            <span className="text-gray-800 font-medium truncate text-xs">
                                                {item.name} <span className="text-gray-400 font-normal ml-1">in {item.category}</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-[12px] text-gray-400 font-medium">
                                                {(item.reviews * 123 + 456).toLocaleString()}
                                            </span>
                                            <ArrowLeft className="w-4 h-4 text-gray-300 rotate-135 shrink-0" />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <p className="text-gray-500 text-xs">No results found for "{query}"</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-6">
                            <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-6">Popular Searches</h3>
                            <div className="flex flex-col gap-1">
                                {['Linen Shirt', 'Silk Kurta', 'Denim Jacket', 'Sneakers', 'Cologne', 'Leather Belt'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setQuery(cat)}
                                        className="flex items-center py-3 border-b border-gray-50 text-xs text-gray-700 hover:text-black text-left"
                                    >
                                        <SearchIcon className="w-3.5 h-3.5 mr-3 text-gray-400" />
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
}
