'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function DripDropBanner() {
    return (
        <section className="py-6 lg:py-16 bg-white">
            <div className="container mx-auto px-4 lg:px-4 xl:px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {/* Left Banner - New Arrivals */}
                    <Link
                        href="/products?collection=new-arrivals"
                        className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="relative aspect-21/9 lg:aspect-4/3 overflow-hidden bg-gray-200">
                            <Image
                                src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1200&q=80"
                                alt="New Arrivals"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-8 text-white">
                                <p className="text-[8px] lg:text-sm font-semibold mb-1 tracking-wider uppercase">
                                    Just Dropped
                                </p>
                                <h3 className="text-section-title font-black mb-1 lg:mb-3 leading-tight">
                                    NEW ARRIVALS
                                </h3>
                                <p className="text-[9px] lg:text-sm text-gray-200 mb-2 lg:mb-4 max-w-[200px] lg:max-w-md line-clamp-1 lg:line-clamp-none">
                                    Discover the latest trends in men's fashion
                                </p>
                                <button className="bg-white text-black px-3 py-1 lg:px-6 lg:py-2.5 rounded-full font-bold text-[9px] lg:text-sm hover:bg-gray-100 transition-colors duration-300 inline-flex items-center gap-1 lg:gap-2">
                                    Shop Now
                                    <svg className="w-2 h-2 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </Link>

                    {/* Right Banner - Best Sellers */}
                    <Link
                        href="/products?collection=best-sellers"
                        className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="relative aspect-21/9 lg:aspect-4/3 overflow-hidden bg-gray-200">
                            <Image
                                src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1200&q=80"
                                alt="Best Sellers"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-8 text-white">
                                <p className="text-[8px] lg:text-sm font-semibold mb-1 tracking-wider uppercase">
                                    Customer Favorites
                                </p>
                                <h3 className="text-section-title font-black mb-1 lg:mb-3 leading-tight">
                                    BEST SELLERS
                                </h3>
                                <p className="text-[9px] lg:text-sm text-gray-200 mb-2 lg:mb-4 max-w-[200px] lg:max-w-md line-clamp-1 lg:line-clamp-none">
                                    Shop our most-loved styles this season
                                </p>
                                <button className="bg-white text-black px-3 py-1 lg:px-6 lg:py-2.5 rounded-full font-bold text-[9px] lg:text-sm hover:bg-gray-100 transition-colors duration-300 inline-flex items-center gap-1 lg:gap-2">
                                    Explore Now
                                    <svg className="w-2 h-2 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
