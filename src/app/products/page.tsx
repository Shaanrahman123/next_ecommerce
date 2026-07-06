'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, ChevronDown, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import ProductFilters from '@/components/product/ProductFilters';
import AppliedFiltersBar from '@/components/product/AppliedFiltersBar';
import MobileFilterDrawer from '@/components/product/MobileFilterDrawer';
import { storefrontProductService } from '@/services/storefrontProduct.service';
import { toStorefrontProduct } from '@/lib/storefrontProductMapper';
import { buildProductQueryParams, getAppliedFilterLabels } from '@/lib/buildProductQuery';
import { FilterSection, CategoryContextDto } from '@/types/filters';
import { Product } from '@/types';

const sortOptions = [
    { id: 'recommended', label: 'Recommended', icon: '⭐' },
    { id: 'popularity', label: 'Popularity', icon: '🔥' },
    { id: 'price-low-high', label: 'Price: Low to High', icon: '₹' },
    { id: 'price-high-low', label: 'Price: High to Low', icon: '₹' },
    { id: 'newest', label: 'Latest', icon: '✨' },
    { id: 'rating', label: 'Customer Rating', icon: '⭐' },
    { id: 'discount', label: 'Discount', icon: '%' },
];

function ProductsContent() {
    const searchParams = useSearchParams();
    const department = searchParams.get('department');
    const category = searchParams.get('category');
    const item = searchParams.get('item');

    const [filters, setFilters] = useState<Record<string, unknown>>({});
    const [filterSections, setFilterSections] = useState<FilterSection[]>([]);
    const [context, setContext] = useState<CategoryContextDto | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [totalDocs, setTotalDocs] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [sortBy, setSortBy] = useState('recommended');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [showMobileSort, setShowMobileSort] = useState(false);
    const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
    const [isLoadingFilters, setIsLoadingFilters] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

  const searchQuery = searchParams.get('search');
  const categoryKey = `${department || ''}-${category || ''}-${item || ''}-${searchQuery || ''}`;

    const loadFilters = useCallback(async () => {
        setIsLoadingFilters(true);
        try {
            const data = await storefrontProductService.getFilters({
                department: department || undefined,
                category: category || undefined,
                item: item || undefined,
            });
            setFilterSections(data.sections || []);
            setContext(data.context);
            const priceSection = data.sections?.find((s) => s.id === 'price');
            if (priceSection) {
                setPriceRange([priceSection.min ?? 0, priceSection.max ?? 10000]);
            }
        } catch {
            setFilterSections([]);
        } finally {
            setIsLoadingFilters(false);
        }
    }, [department, category, item]);

    const loadProducts = useCallback(async (pageNum: number, append = false) => {
        if (append) setIsLoadingMore(true);
        else setIsLoadingProducts(true);

        try {
            const query = buildProductQueryParams({
                department,
                category,
                item,
                filters,
                sections: filterSections,
                priceRange,
                sortBy,
                page: pageNum,
                limit: 20,
            });
            if (searchQuery) query.set('search', searchQuery);

            const res = await storefrontProductService.listProducts(query);
            const mapped = (res.data || []).map(toStorefrontProduct);

            if (append) {
                setProducts((prev) => [...prev, ...mapped]);
            } else {
                setProducts(mapped);
            }

            if (res.context) setContext(res.context);
            setTotalDocs(res.meta?.totalDocs ?? mapped.length);
            setHasMore(res.meta?.hasNextPage ?? false);
            setPage(pageNum);
        } catch {
            if (!append) setProducts([]);
        } finally {
            setIsLoadingProducts(false);
            setIsLoadingMore(false);
        }
    }, [department, category, item, searchQuery, filters, filterSections, priceRange, sortBy]);

    useEffect(() => {
        setFilters({});
        setPage(1);
        loadFilters();
    }, [categoryKey, loadFilters]);

    useEffect(() => {
        if (!isLoadingFilters) {
            setPage(1);
            loadProducts(1, false);
        }
    }, [filters, sortBy, priceRange, categoryKey, isLoadingFilters, loadProducts]);

    const appliedFilters = useMemo(
        () => getAppliedFilterLabels(filters, filterSections),
        [filters, filterSections]
    );

    const pageTitle = context?.pageTitle || 'All Products';
    const breadcrumb = context?.breadcrumb || [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
    ];

    const handleFilterChange = (newFilters: Record<string, unknown>) => {
        setFilters(newFilters);
    };

    const handleRemoveFilter = (filterId: string, section: string) => {
        setFilters((prev) => {
            const updated = { ...prev };
            if (Array.isArray(updated[section])) {
                updated[section] = (updated[section] as string[]).filter((id) => id !== filterId);
                if ((updated[section] as string[]).length === 0) delete updated[section];
            } else {
                delete updated[section];
            }
            return updated;
        });
    };

    const handleClearAllFilters = () => {
        setFilters({});
        const priceSection = filterSections.find((s) => s.id === 'price');
        setPriceRange([priceSection?.min ?? 0, priceSection?.max ?? 10000]);
    };

    const handleCheckboxChange = (sectionId: string, optionId: string) => {
        setFilters((prev) => {
            const sectionFilters = (prev[sectionId] as string[]) || [];
            const newFilters = sectionFilters.includes(optionId)
                ? sectionFilters.filter((id) => id !== optionId)
                : [...sectionFilters, optionId];
            return { ...prev, [sectionId]: newFilters };
        });
    };

    const handleRadioChange = (sectionId: string, optionId: string) => {
        setFilters((prev) => ({ ...prev, [sectionId]: optionId }));
    };

    const handleLoadMore = () => {
        if (hasMore && !isLoadingMore) loadProducts(page + 1, true);
    };

    return (
        <div className="min-h-screen bg-white pb-20 lg:pb-0">
            <div className="hidden lg:block border-b border-gray-200 py-3 px-8 lg:px-16 xl:px-24 container mx-auto">
                <div className="flex items-center gap-2 text-xs flex-wrap">
                    {breadcrumb.map((crumb, i) => (
                        <span key={crumb.href + crumb.label} className="flex items-center gap-2">
                            {i > 0 && <ChevronRight className="w-3 h-3 text-gray-400" />}
                            {i < breadcrumb.length - 1 ? (
                                <Link href={crumb.href} className="text-gray-600 hover:text-gray-900">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-gray-900 font-semibold">{crumb.label}</span>
                            )}
                        </span>
                    ))}
                </div>
            </div>

            <div className="border-b border-gray-200 py-3 lg:py-4 px-4 lg:px-8 xl:px-24 container mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-page-title text-gray-900">{pageTitle}</h1>
                        <span className="text-small text-gray-600">
                            {isLoadingProducts ? 'Loading...' : `${totalDocs} items`}
                        </span>
                    </div>

                    <div className="hidden lg:block relative">
                        <button
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm hover:border-gray-400 transition-colors"
                        >
                            <span className="text-xs">Sort by:</span>
                            <span className="font-semibold text-xs">
                                {sortOptions.find((opt) => opt.id === sortBy)?.label}
                            </span>
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {showSortDropdown && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                setSortBy(option.id);
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                                                sortBy === option.id ? 'bg-gray-100 font-semibold' : ''
                                            }`}
                                        >
                                            {sortBy === option.id && (
                                                <span className="text-green-600 mr-2">✓</span>
                                            )}
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 lg:px-8 xl:px-24 container mx-auto py-4 lg:py-6">
                <div className="flex gap-8">
                    <div className="hidden lg:block">
                        <ProductFilters
                            sections={filterSections}
                            selectedFilters={filters}
                            priceRange={priceRange}
                            onPriceRangeChange={setPriceRange}
                            onFilterChange={handleFilterChange}
                            isLoading={isLoadingFilters}
                        />
                    </div>

                    <div className="flex-1">
                        <div className="hidden lg:block">
                            <AppliedFiltersBar
                                filters={appliedFilters}
                                onRemove={handleRemoveFilter}
                                onClearAll={handleClearAllFilters}
                            />
                        </div>

                        {isLoadingProducts && products.length === 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-3" />
                                        <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-gray-100 rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} compact />
                                ))}
                            </div>
                        )}

                        {hasMore && products.length > 0 && (
                            <div className="text-center mt-8 lg:mt-12">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                    className="px-6 lg:px-8 py-2.5 lg:py-3 border-2 border-primary text-heading font-semibold rounded text-sm hover:bg-primary hover:text-on-primary transition-colors duration-300 disabled:opacity-60"
                                >
                                    {isLoadingMore ? 'Loading...' : 'Load More Products'}
                                </button>
                            </div>
                        )}

                        {!isLoadingProducts && products.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-600 text-base lg:text-lg mb-4">No products found</p>
                                <button
                                    onClick={handleClearAllFilters}
                                    className="text-sm text-heading font-semibold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:hidden fixed bottom-0 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] left-0 right-0 bg-white border-t border-gray-200 z-30">
                <div className="grid grid-cols-2 divide-x divide-gray-200">
                    <button
                        onClick={() => setShowMobileSort(true)}
                        className="flex items-center justify-center gap-2 py-4 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowUpDown className="w-5 h-5" />
                        <span className="font-semibold text-sm">SORT</span>
                    </button>
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="flex items-center justify-center gap-2 py-4 hover:bg-gray-50 transition-colors"
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        <span className="font-semibold text-sm">FILTER</span>
                    </button>
                </div>
            </div>

            {showMobileSort && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowMobileSort(false)} />
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 lg:hidden animate-slide-up">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold">SORT BY</h3>
                                <button onClick={() => setShowMobileSort(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => {
                                        setSortBy(option.id);
                                        setShowMobileSort(false);
                                    }}
                                    className={`w-full text-left px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                                        sortBy === option.id ? 'bg-gray-100' : ''
                                    }`}
                                >
                                    <span className="text-xl">{option.icon}</span>
                                    <span className={`flex-1 ${sortBy === option.id ? 'font-semibold' : ''}`}>
                                        {option.label}
                                    </span>
                                    {sortBy === option.id && <span className="text-green-600 text-xl">✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {showMobileFilters && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowMobileFilters(false)} />
                    <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-white">
                        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shrink-0">
                            <h3 className="text-sm font-bold uppercase">FILTERS</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleClearAllFilters}
                                    className="text-xs text-[var(--theme-primary)] font-semibold uppercase"
                                >
                                    CLEAR ALL
                                </button>
                                <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <MobileFilterDrawer
                                sections={filterSections}
                                selectedFilters={filters}
                                onFilterChange={(sectionId, optionId, type) => {
                                    if (type === 'checkbox') handleCheckboxChange(sectionId, optionId);
                                    else handleRadioChange(sectionId, optionId);
                                }}
                                onPriceChange={(min, max) => setPriceRange([min, max])}
                                priceRange={priceRange}
                            />
                        </div>
                        <div className="bg-white border-t border-gray-200 p-4 shrink-0">
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="w-full bg-primary text-on-primary py-3 rounded text-sm font-semibold hover:bg-primary-hover transition-colors uppercase"
                            >
                                APPLY ({totalDocs} items)
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading products...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
