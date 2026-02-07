'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, User, ShoppingCart } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/store';
import { useEffect } from 'react';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { getItemCount } = useCartStore();
    const { items: wishlistItems } = useWishlistStore();

    // Define pages where bottom nav should be hidden
    const hideOnPaths = [
        '/checkout',
        '/order-success',
    ];

    // Check if current path starts with /products (covers both list and details)
    const isProductPage = pathname.startsWith('/products');
    const isCheckoutPage = pathname.startsWith('/checkout');
    const isCartPage = pathname === '/cart';
    const isOrderSuccessPage = pathname === '/order-success';

    const showBottomNav = !(hideOnPaths.includes(pathname) || isCheckoutPage || isOrderSuccessPage || isProductPage);

    // Add padding to body when bottom nav is shown
    useEffect(() => {
        if (showBottomNav) {
            document.body.classList.add('has-bottom-nav');
        } else {
            document.body.classList.remove('has-bottom-nav');
        }
        return () => document.body.classList.remove('has-bottom-nav');
    }, [showBottomNav]);

    if (!showBottomNav) {
        return null;
    }

    const cartItemCount = getItemCount();

    const navItems = [
        { label: 'Home', icon: Home, href: '/' },
        { label: 'Wishlist', icon: Heart, href: '/wishlist', count: wishlistItems.length },
        { label: 'Account', icon: User, href: '/account' },
        { label: 'Cart', icon: ShoppingCart, href: '/cart', count: cartItemCount },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe-area-inset-bottom">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${isActive ? 'text-black font-bold' : 'text-gray-500 hover:text-black'
                                }`}
                        >
                            <div className="relative">
                                <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                                {item.count !== undefined && item.count > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-black text-white text-[12px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                        {item.count}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
