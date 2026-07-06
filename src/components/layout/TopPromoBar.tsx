'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function TopPromoBar() {
  const pathname = usePathname();

  const hideOnMobilePaths = ['/checkout', '/order-success', '/products'];
  const isHiddenOnMobile = hideOnMobilePaths.some((path) => pathname.startsWith(path));

  return (
    <div
      className={`sticky top-0 z-40 bg-linear-to-r from-[#1a1209] via-heading to-[#1a1209] text-amber-50 py-2 px-4 text-center text-sm font-medium border-b border-amber-500/20 ${
        isHiddenOnMobile ? 'hidden lg:block' : ''
      }`}
    >
      <div className="container mx-auto px-1 lg:px-16 xl:px-24">
        <p className="flex items-center text-xs md:text-sm justify-center gap-2 flex-wrap">
          <span>Get Up to 70% OFF on All Products</span>
          <Link
            href="/products?sale=mega"
            className="text-amber-300 hover:text-amber-100 underline underline-offset-2 ml-1 transition-colors"
          >
            Shop Now →
          </Link>
        </p>
      </div>
    </div>
  );
}
