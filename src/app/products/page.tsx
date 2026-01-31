'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, ChevronDown, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import ProductFilters, { getFilterSectionsForCategory } from '@/components/product/ProductFilters';
import AppliedFiltersBar from '@/components/product/AppliedFiltersBar';
import MobileFilterDrawer from '@/components/product/MobileFilterDrawer';
import { mockProducts } from '@/data/products';

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
    const [filters, setFilters] = useState<any>({});
    const [sortBy, setSortBy] = useState('recommended');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [showMobileSort, setShowMobileSort] = useState(false);
    const [priceRange, setPriceRange] = useState<number[]>([180, 11000]);

    // Detect current category from URL params
    const currentCategory = searchParams.get('category') || searchParams.get('item') || 'all';

    // Get applied filters for display
    const appliedFilters = useMemo(() => {
        const applied: any[] = [];

        // Helper function to format filter labels
        const formatLabel = (id: string) => {
            return id
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };

        Object.entries(filters).forEach(([section, value]) => {
            // Handle array filters (checkboxes)
            if (Array.isArray(value) && value.length > 0) {
                value.forEach((id: string) => {
                    applied.push({
                        id,
                        label: formatLabel(id),
                        section,
                    });
                });
            }
            // Handle single value filters (radio buttons)
            else if (typeof value === 'string' && value) {
                applied.push({
                    id: value,
                    label: formatLabel(value),
                    section,
                });
            }
            // Skip price range as it's not shown as a pill
        });

        return applied;
    }, [filters]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let products = [...mockProducts];

        // Apply filters
        if (filters.brand?.length > 0) {
            products = products.filter(() => Math.random() > 0.3);
        }

        if (filters.color?.length > 0) {
            products = products.filter(p =>
                filters.color.some((color: string) =>
                    p.colors.some((c: string) => c.toLowerCase().includes(color))
                )
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'price-low-high':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'discount':
                products.sort((a, b) => {
                    const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
                    const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
                    return discountB - discountA;
                });
                break;
        }

        return products;
    }, [filters, sortBy]);

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
    };

    const handleRemoveFilter = (filterId: string, section: string) => {
        setFilters((prev: any) => {
            const updated = { ...prev };
            if (Array.isArray(updated[section])) {
                updated[section] = updated[section].filter((id: string) => id !== filterId);
                if (updated[section].length === 0) {
                    delete updated[section];
                }
            } else {
                delete updated[section];
            }
            return updated;
        });
    };

    const handleClearAllFilters = () => {
        setFilters({});
        setPriceRange([180, 11000]);
    };

    const handleCheckboxChange = (sectionId: string, optionId: string) => {
        setFilters((prev: any) => {
            const sectionFilters = prev[sectionId] || [];
            const newFilters = sectionFilters.includes(optionId)
                ? sectionFilters.filter((id: string) => id !== optionId)
                : [...sectionFilters, optionId];

            const updated = { ...prev, [sectionId]: newFilters };
            return updated;
        });
    };

    const handleRadioChange = (sectionId: string, optionId: string) => {
        setFilters((prev: any) => {
            const updated = { ...prev, [sectionId]: optionId };
            return updated;
        });
    };

    // Get filter sections for the current category
    const filterSections = useMemo(() => {
        return getFilterSectionsForCategory(currentCategory);
    }, [currentCategory]);

    return (
        <div className="min-h-screen bg-white pb-20 lg:pb-0">
            {/* Breadcrumb - Hidden on mobile */}
            <div className="hidden lg:block border-b border-gray-200 py-3 px-8 lg:px-16 xl:px-24 container mx-auto">
                <div className="flex items-center gap-2 text-xs">
                    <Link href="/" className="text-gray-600 hover:text-gray-900">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <Link href="/products" className="text-gray-600 hover:text-gray-900">
                        Clothing
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <Link href="/products" className="text-gray-600 hover:text-gray-900">
                        Shirts
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-900 font-semibold">Men's Casual Wear</span>
                </div>
            </div>

            {/* Page Header */}
            <div className="border-b border-gray-200 py-3 lg:py-4 px-4 lg:px-8 xl:px-24 container mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-page-title text-gray-900">
                            Men's Casual Wear
                        </h1>
                        <span className="text-small text-gray-600">
                            {filteredProducts.length} items
                        </span>
                    </div>

                    {/* Desktop Sort Dropdown */}
                    <div className="hidden lg:block relative">
                        <button
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm hover:border-gray-400 transition-colors"
                        >
                            <span className="text-xs">Sort by:</span>
                            <span className="font-semibold text-xs">
                                {sortOptions.find(opt => opt.id === sortBy)?.label}
                            </span>
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {showSortDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowSortDropdown(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                setSortBy(option.id);
                                                setShowSortDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${sortBy === option.id ? 'bg-gray-100 font-semibold' : ''
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

            {/* Main Content */}
            <div className="px-4 lg:px-8 xl:px-24 container mx-auto py-4 lg:py-6">
                <div className="flex gap-8">
                    {/* Desktop Filters Sidebar */}
                    <div className="hidden lg:block">
                        <ProductFilters onFilterChange={handleFilterChange} category={currentCategory} />
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Applied Filters - Desktop */}
                        <div className="hidden lg:block">
                            <AppliedFiltersBar
                                filters={appliedFilters}
                                onRemove={handleRemoveFilter}
                                onClearAll={handleClearAllFilters}
                            />
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} compact />
                            ))}
                        </div>

                        {/* Load More */}
                        {filteredProducts.length > 0 && (
                            <div className="text-center mt-8 lg:mt-12">
                                <button className="px-6 lg:px-8 py-2.5 lg:py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded text-sm hover:bg-gray-900 hover:text-white transition-colors duration-300">
                                    Load More Products
                                </button>
                            </div>
                        )}

                        {/* No Results */}
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-600 text-base lg:text-lg mb-4">No products found</p>
                                <button
                                    onClick={handleClearAllFilters}
                                    className="text-sm text-red-600 font-semibold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
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

            {/* Mobile Sort Drawer */}
            {showMobileSort && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setShowMobileSort(false)}
                    />
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 lg:hidden animate-slide-up">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold">SORT BY</h3>
                                <button
                                    onClick={() => setShowMobileSort(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
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
                                    className={`w-full text-left px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${sortBy === option.id ? 'bg-gray-100' : ''
                                        }`}
                                >
                                    <span className="text-xl">{option.icon}</span>
                                    <span className={`flex-1 ${sortBy === option.id ? 'font-semibold' : ''}`}>
                                        {option.label}
                                    </span>
                                    {sortBy === option.id && (
                                        <span className="text-green-600 text-xl">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Mobile Filter Drawer */}
            {showMobileFilters && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setShowMobileFilters(false)}
                    />
                    <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-white">
                        {/* Header */}
                        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shrink-0">
                            <h3 className="text-sm font-bold uppercase">FILTERS</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleClearAllFilters}
                                    className="text-xs text-red-600 font-semibold uppercase"
                                >
                                    CLEAR ALL
                                </button>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Filter Content */}
                        <div className="flex-1 overflow-hidden">
                            <MobileFilterDrawer
                                sections={filterSections}
                                selectedFilters={filters}
                                onFilterChange={(sectionId, optionId, type) => {
                                    if (type === 'checkbox') {
                                        handleCheckboxChange(sectionId, optionId);
                                    } else {
                                        handleRadioChange(sectionId, optionId);
                                    }
                                }}
                                onPriceChange={(min, max) => {
                                    const newRange = [min, max];
                                    setPriceRange(newRange);
                                    setFilters((prev: any) => {
                                        const updated = { ...prev, price: newRange };
                                        handleFilterChange(updated);
                                        return updated;
                                    });
                                }}
                                priceRange={priceRange}
                            />
                        </div>

                        {/* Footer */}
                        <div className="bg-white border-t border-gray-200 p-4 shrink-0">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="flex-1 bg-white text-gray-900 border border-gray-300 py-3 rounded text-sm font-semibold hover:bg-gray-50 transition-colors uppercase"
                                >
                                    CLOSE
                                </button>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="flex-1 bg-red-600 text-white py-3 rounded text-sm font-semibold hover:bg-red-700 transition-colors uppercase"
                                >
                                    APPLY
                                </button>
                            </div>
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
