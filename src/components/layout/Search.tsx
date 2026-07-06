'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search as SearchIcon, X, ArrowLeft, Loader2, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ProductSearchResult, SearchSuggestion } from '@/app/api/product/search/route';

interface SearchProps {
  variant?: 'desktop' | 'overlay';
  isOpen?: boolean;
  onClose?: () => void;
  theme?: 'dark' | 'premium';
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Search({ variant = 'desktop', isOpen, onClose, theme = 'premium' }: SearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [products, setProducts] = useState<ProductSearchResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debouncedQuery = useDebouncedValue(query, 300);
  const isPremium = theme === 'premium';

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setProducts([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/product/search?q=${encodeURIComponent(q)}&limit=8`);
      const json = await res.json();
      const data = json.data as { suggestions?: SearchSuggestion[]; products?: ProductSearchResult[] } | ProductSearchResult[] | undefined;

      if (Array.isArray(data)) {
        setSuggestions([]);
        setProducts(data);
        setIsDropdownOpen(data.length > 0);
      } else {
        const nextSuggestions = data?.suggestions || [];
        const nextProducts = data?.products || [];
        setSuggestions(nextSuggestions);
        setProducts(nextProducts);
        setIsDropdownOpen(nextSuggestions.length > 0 || nextProducts.length > 0);
      }
    } catch {
      setSuggestions([]);
      setProducts([]);
      setIsDropdownOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery, fetchSuggestions]);

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
      setSuggestions([]);
      setProducts([]);
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

  const handleSelect = () => {
    setIsDropdownOpen(false);
    onClose?.();
    setQuery('');
  };

  const inputClass = isPremium
    ? 'border-amber-200/80 bg-white text-heading placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 shadow-sm'
    : 'border-white/20 bg-white/10 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/40';

  const iconClass = isPremium
    ? 'text-amber-700/60 group-focus-within:text-amber-800'
    : 'text-white/60 group-focus-within:text-white';

  const SuggestionTypeLabel: Record<SearchSuggestion['type'], string> = {
    term: 'Search',
    category: 'Category',
    subcategory: 'Collection',
    brand: 'Brand',
  };

  const SuggestionsList = ({ compact = false }: { compact?: boolean }) => (
    <>
      {isLoading && (
        <div className={`flex items-center justify-center gap-2 ${compact ? 'py-6' : 'py-4'}`}>
          <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
          <span className="text-xs text-gray-500">Searching...</span>
        </div>
      )}

      {!isLoading && suggestions.length > 0 && (
        <div className="py-1 border-b border-amber-50">
          <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-amber-800/60 uppercase tracking-widest">
            Matching searches
          </p>
          {suggestions.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 hover:bg-amber-50/80 transition-colors ${
                compact ? 'px-4 py-3 border-b border-amber-50/80 last:border-0' : 'px-4 py-2.5'
              }`}
              onClick={handleSelect}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                {item.type === 'term' ? (
                  <SearchIcon className="w-4 h-4 text-amber-700" />
                ) : (
                  <Tag className="w-4 h-4 text-amber-700" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-heading truncate">{item.label}</div>
                <div className="text-[11px] text-gray-500 truncate">
                  {item.subtitle || SuggestionTypeLabel[item.type]}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div className="py-1">
          <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-amber-800/60 uppercase tracking-widest">
            Suggested products
          </p>
          {products.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              className={`flex items-center gap-3 hover:bg-amber-50/80 transition-colors ${
                compact ? 'px-4 py-3 border-b border-amber-50' : 'px-4 py-2.5'
              }`}
              onClick={handleSelect}
            >
              <div className="relative w-11 h-11 bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-amber-100">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="44px" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-heading truncate">{item.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{item.category}</span>
                  <span className="text-amber-700 font-medium">₹{item.price.toFixed(0)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && query.length >= 2 && suggestions.length === 0 && products.length === 0 && (
        <div className={`text-center text-sm text-gray-500 ${compact ? 'py-10' : 'py-6'}`}>
          No results for &ldquo;{query}&rdquo;
        </div>
      )}
    </>
  );

  if (variant === 'desktop') {
    return (
      <div className="hidden lg:relative lg:block flex-1 max-w-xl mx-6 group" ref={dropdownRef}>
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <SearchIcon className={`h-4 w-4 transition-colors ${iconClass}`} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands and more"
            className={`block w-full pl-10 pr-3 py-2.5 border rounded-full leading-5 focus:outline-none transition-all text-sm ${inputClass}`}
            onFocus={() => query.length >= 2 && (suggestions.length > 0 || products.length > 0) && setIsDropdownOpen(true)}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setProducts([]);
                setIsDropdownOpen(false);
              }}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {isDropdownOpen && (suggestions.length > 0 || products.length > 0 || isLoading) && (
          <div className="absolute z-50 mt-2 w-full bg-white shadow-2xl rounded-xl border border-amber-100 overflow-hidden">
            <SuggestionsList />
            {(suggestions.length > 0 || products.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  router.push(`/products?search=${encodeURIComponent(query)}`);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2.5 text-xs font-semibold text-amber-800 bg-amber-50/50 border-t border-amber-100 hover:bg-amber-50 transition-colors"
              >
                View all results for &ldquo;{query}&rdquo;
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'overlay' && isOpen) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#faf7f2] animate-slide-up flex flex-col">
        <div className="flex items-center p-4 gap-3 border-b border-amber-100 bg-white">
          <button onClick={onClose} className="text-heading p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <form onSubmit={handleSearch} className="flex-1 relative">
            <input
              ref={mobileInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for brands and products"
              className="w-full py-2.5 px-4 pr-10 border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-200/50 text-sm placeholder-gray-400 bg-white"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700">
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto">
          {query.length >= 2 ? (
            <div className="bg-white">
              <SuggestionsList compact />
            </div>
          ) : (
            <div className="p-6">
              <h3 className="text-xs font-bold text-amber-800/60 uppercase tracking-widest mb-4">
                Popular Searches
              </h3>
              <div className="flex flex-col gap-1">
                {['T-Shirts', 'Jeans', 'Kurta', 'Sneakers', 'Watch', 'Saree'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="flex items-center py-3 border-b border-amber-50 text-sm text-heading hover:text-amber-800 text-left"
                  >
                    <SearchIcon className="w-4 h-4 mr-3 text-amber-400" />
                    {term}
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
