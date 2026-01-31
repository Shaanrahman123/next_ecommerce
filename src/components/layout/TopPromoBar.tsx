'use client';

import Link from 'next/link';

export default function TopPromoBar() {
    return (
        <div className="bg-gradient-to-r sticky top-0 z-50 from-yellow-400 via-orange-500 to-red-500 text-white py-2 px-4 text-center text-sm font-semibold">
            <div className="container mx-auto px-8 lg:px-16 xl:px-24">
                <p className="flex items-center justify-center gap-2 flex-wrap">
                    <span className="animate-pulse">🎉</span>
                    <span>MEGA SALE! Get Up to 70% OFF on All Products</span>
                    <span className="animate-pulse">🎉</span>
                    <Link href="/products?sale=mega" className="underline hover:text-yellow-200 ml-2">
                        Shop Now →
                    </Link>
                </p>
            </div>
        </div>
    );
}
