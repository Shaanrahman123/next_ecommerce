'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
    const pathname = usePathname();

    const hideOnMobilePaths = [
        '/checkout',
        '/order-success',
        '/products'
    ];

    const isHiddenOnMobile = hideOnMobilePaths.some(path => pathname.startsWith(path));

    return (
        <footer className={`bg-[var(--theme-primary)] text-[var(--theme-secondary)] mt-5 lg:mt-10 ${isHiddenOnMobile ? 'hidden lg:block' : ''}`}>
            <div className="container mx-auto px-8 lg:px-16 xl:px-24 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">MINIMAL</h3>
                        <p className="text-sm text-gray-300">
                            Premium minimalist fashion for the modern individual.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-gray-300 transition-colors duration-300"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-gray-300 transition-colors duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-gray-300 transition-colors duration-300"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-white transition-colors duration-300">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?gender=men" className="text-gray-300 hover:text-white transition-colors duration-300">
                                    Men
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?gender=women" className="text-gray-300 hover:text-white transition-colors duration-300">
                                    Women
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=accessories" className="text-gray-300 hover:text-white transition-colors duration-300">
                                    Accessories
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors duration-300">
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors duration-300">
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors duration-300">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold mb-4">Newsletter</h4>
                        <p className="text-sm text-gray-300 mb-4">
                            Subscribe to get special offers and updates.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-2 bg-white text-black rounded-l-lg focus:outline-none"
                            />
                            <button className="px-4 py-2 bg-[var(--theme-accent)] hover:bg-gray-800 rounded-r-lg transition-colors duration-300">
                                <Mail className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-300">
                    <p>&copy; {new Date().getFullYear()} MINIMAL. All rights reserved.</p>
                    <div className="mt-2 space-x-4">
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
