'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function TopPromoBar() {
    const pathname = usePathname();

    const hideOnMobilePaths = [
        '/checkout',
        '/order-success',
        '/products'
    ];

    const isHiddenOnMobile = hideOnMobilePaths.some(path => pathname.startsWith(path));

    return (
        <div className={`bg-gradient-to-r sticky top-0 z-40 from-yellow-400 via-orange-500 to-red-500 text-white py-2 px-4 text-center text-sm font-semibold ${isHiddenOnMobile ? 'hidden lg:block' : ''}`}>
            <div className="container mx-auto px-1 lg:px-16 xl:px-24">
                <p className="flex items-center text-xs md:text-sm justify-center gap-2 flex-wrap">
                    {/* <span className="animate-pulse">🎉</span> */}
                    <span>Get Up to 70% OFF on All Products</span>
                    {/* <span className="animate-pulse">🎉</span> */}
                    <Link href="/products?sale=mega" className="underline hover:text-yellow-200 ml-2">
                        Shop Now →
                    </Link>
                </p>
            </div>
        </div>
    );
}
