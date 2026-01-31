'use client';

import Link from 'next/link';
import { genderCategories } from '@/data/products';
import { ArrowRight } from 'lucide-react';

export default function GenderSection() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-[var(--theme-primary)] mb-4">
                    Shop by Gender
                </h2>
                <p className="text-lg text-[var(--theme-text-secondary)] max-w-2xl mx-auto">
                    Find the perfect style for everyone
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {genderCategories.map((gender, index) => (
                    <Link
                        key={gender.id}
                        href={`/products?gender=${gender.id}`}
                        className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gradient-to-br from-gray-900 to-gray-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }} />
                        </div>

                        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center text-white">
                            <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                                {gender.icon}
                            </div>
                            <h3 className="text-3xl font-bold mb-4">
                                {gender.name}
                            </h3>
                            <div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                                <span className="text-lg">Shop Now</span>
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>
                ))}
            </div>
        </section>
    );
}
