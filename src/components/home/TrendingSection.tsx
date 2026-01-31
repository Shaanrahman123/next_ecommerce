'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp } from 'lucide-react';

const trendingCategories = [
    {
        id: 1,
        name: 'Oversized Tees',
        trend: '+245%',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80',
        link: '/products?trending=oversized-tees',
    },
    {
        id: 2,
        name: 'Linen Shirts',
        trend: '+189%',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80',
        link: '/products?trending=linen-shirts',
    },
    {
        id: 3,
        name: 'Cargo Pants',
        trend: '+156%',
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80',
        link: '/products?trending=cargo-pants',
    },
    {
        id: 4,
        name: 'Chunky Sneakers',
        trend: '+143%',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&q=80',
        link: '/products?trending=sneakers',
    },
    {
        id: 5,
        name: 'Smart Watches',
        trend: '+138%',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
        link: '/products?trending=smartwatches',
    },
    {
        id: 6,
        name: 'Aviator Sunglasses',
        trend: '+120%',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80',
        link: '/products?trending=sunglasses',
    },
];

export default function TrendingSection() {
    return (
        <section className="py-12 px-8 lg:px-16 xl:px-24 container mx-auto bg-gradient-to-b from-white to-gray-50">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-gray-900" />
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                        TRENDING NOW
                    </h2>
                </div>
                <p className="text-sm text-gray-600">
                    Most popular in Men's Fashion
                </p>
                <div className="h-0.5 w-24 bg-gray-900 mx-auto mt-4" />
            </div>

            {/* Trending Grid - Scrollable on mobile, Grid on Desktop */}
            <div className="flex overflow-x-auto gap-4 pb-6 lg:grid lg:grid-cols-6 lg:pb-0 scrollbar-hide snap-x">
                {trendingCategories.map((category, index) => (
                    <Link
                        key={category.id}
                        href={category.link}
                        className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 bg-white min-w-[160px] snap-start"
                    >
                        <div className="relative">
                            {/* Rank Badge */}
                            <div className="absolute top-2 left-2 bg-gray-900 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs z-10">
                                {index + 1}
                            </div>

                            {/* Trend Badge */}
                            <div className="absolute top-2 right-2 bg-gray-200 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 text-gray-900 z-10">
                                <TrendingUp className="w-3 h-3" />
                                {category.trend}
                            </div>

                            {/* Product Image */}
                            <div className="aspect-square relative bg-gray-100">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            {/* Category Name */}
                            <div className="p-4 text-center">
                                <h3 className="text-sm font-black text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                                    {category.name}
                                </h3>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
