'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
    const pathname = usePathname();

    const hideTotallyPaths = [
        '/order-success',
        '/orders',
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/verify-otp'
    ];

    const hideOnMobilePaths = [
        '/checkout',
        '/products'
    ];

    const isHiddenTotally = hideTotallyPaths.some(path => pathname.startsWith(path));
    const isHiddenOnMobile = hideOnMobilePaths.some(path => pathname.startsWith(path));

    if (isHiddenTotally) return null;

    return (
        <footer className={`bg-[var(--theme-primary)] text-white mt-5 lg:mt-10 ${isHiddenOnMobile ? 'hidden lg:block' : ''}`}>
            <div className="container mx-auto px-8 lg:px-16 xl:px-24 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="space-y-5">
                        <BrandLogo />
                        <p className="text-sm text-white/70 leading-relaxed">
                            Premium fashion for the modern individual. Crafted with purpose, worn with confidence.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
                                { Icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
                                { Icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
                            ].map(({ Icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 border border-white/15 hover:bg-white/20 transition-colors duration-300"
                                    aria-label={label}
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-bold mb-5 text-white uppercase tracking-widest text-sm">Shop</h4>
                        <ul className="space-y-3 text-sm">
                            {[
                                { label: 'All Products', href: '/products' },
                                { label: 'Men', href: '/products?gender=men' },
                                { label: 'Women', href: '/products?gender=women' },
                                { label: 'Accessories', href: '/products?category=accessories' },
                            ].map(({ label, href }) => (
                                <li key={label}>
                                    <Link href={href} className="text-white/65 hover:text-white transition-colors duration-300">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-bold mb-5 text-white uppercase tracking-widest text-sm">Customer Service</h4>
                        <ul className="space-y-3 text-sm">
                            {[
                                { label: 'Contact Us', href: '/contact' },
                                { label: 'Shipping Info', href: '/shipping' },
                                { label: 'Returns', href: '/returns' },
                                { label: 'FAQ', href: '/faq' },
                            ].map(({ label, href }) => (
                                <li key={label}>
                                    <Link href={href} className="text-white/65 hover:text-white transition-colors duration-300">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold mb-5 text-white uppercase tracking-widest text-sm">Newsletter</h4>
                        <p className="text-sm text-white/65 mb-4 leading-relaxed">
                            Subscribe to get special offers and updates.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 border-r-0 text-white placeholder-white/40 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-white/30 text-sm"
                            />
                            <button className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-r-lg transition-colors duration-300">
                                <Mail className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/15 text-center text-sm text-white/60">
                    <p>&copy; {new Date().getFullYear()} BLAK BLAZE. All rights reserved.</p>
                    <div className="mt-3 flex justify-center gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors duration-300">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-white transition-colors duration-300">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
