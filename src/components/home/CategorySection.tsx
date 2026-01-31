'use client';

import Link from 'next/link';
import { categories } from '@/data/products';
import { ArrowRight } from 'lucide-react';

export default function CategorySection() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-[var(--theme-primary)] mb-4">
                    Shop by Category
                </h2>
                <p className="text-lg text-[var(--theme-text-secondary)] max-w-2xl mx-auto">
                    Explore our curated collections designed for your lifestyle
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categories.map((category, index) => (
                    <Link
                        key={category.id}
                        href={`/products?category=${category.id}`}
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                                {category.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--theme-primary)] mb-2">
                                {category.name}
                            </h3>
                            <div className="flex items-center justify-center gap-2 text-[var(--theme-text-secondary)] group-hover:gap-4 transition-all duration-300">
                                <span>Explore</span>
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-[var(--theme-primary)] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                    </Link>
                ))}
            </div>
        </section>
    );
}
