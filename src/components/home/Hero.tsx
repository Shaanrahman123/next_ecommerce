'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Hero() {
    return (
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Main Content */}
                <div className="space-y-8 animate-fade-in">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[var(--theme-primary)] tracking-tight">
                        MINIMAL
                        <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-2 text-[var(--theme-text-secondary)]">
                            ELEGANCE
                        </span>
                    </h1>

                    <p className="text-body text-gray-600 max-w-3xl mx-auto font-light">
                        Discover timeless pieces that define modern sophistication.
                        <span className="block mt-2">Where simplicity meets luxury.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                        <Link href="/products">
                            <Button size="lg" className="group">
                                <span className="flex items-center gap-2">
                                    Shop Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </Button>
                        </Link>
                        <Link href="/products?featured=true">
                            <Button size="lg" variant="outline">
                                Featured Collection
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16">
                        <div className="space-y-2">
                            <div className="text-3xl sm:text-4xl font-bold text-[var(--theme-primary)]">500+</div>
                            <div className="text-small text-gray-500">Products</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl sm:text-4xl font-bold text-[var(--theme-primary)]">50K+</div>
                            <div className="text-sm text-[var(--theme-text-muted)]">Customers</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl sm:text-4xl font-bold text-[var(--theme-primary)]">4.9</div>
                            <div className="text-sm text-[var(--theme-text-muted)]">Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-[var(--theme-primary)] rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-[var(--theme-primary)] rounded-full" />
                </div>
            </div>
        </section>
    );
}
