'use client';

import Link from 'next/link';
import Image from 'next/image';

const trendingCategories = [
    {
        id: 1,
        name: 'JACKETS',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
        link: '/products?category=jackets',
        span: 'col-span-2',
    },
    {
        id: 2,
        name: 'HOODIES',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
        link: '/products?category=hoodies',
        span: 'col-span-2',
    },
    {
        id: 3,
        name: 'FOOTWEAR',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
        link: '/products?category=footwear',
        span: 'col-span-1',
    },
    {
        id: 4,
        name: 'SHIRTS',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
        link: '/products?category=shirts',
        span: 'col-span-1',
    },
    {
        id: 5,
        name: 'JEANS',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
        link: '/products?category=jeans',
        span: 'col-span-1',
    },
    {
        id: 6,
        name: 'SNEAKERS',
        image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80',
        link: '/products?category=sneakers',
        span: 'col-span-1',
    },
];

export default function TrendingCategoriesSection() {
    return (
        <section className="py-12 px-8 lg:px-16 xl:px-24 container mx-auto bg-gray-50">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                    TRENDING CATEGORIES
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                    Explore what's hot this season
                </p>
                <div className="h-0.5 w-24 bg-gray-900 mx-auto mt-4" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-4">
                {trendingCategories.map((category) => (
                    <Link
                        key={category.id}
                        href={category.link}
                        className={`group relative overflow-hidden rounded-lg hover:shadow-2xl transition-all duration-300 ${category.span}`}
                    >
                        <div className="relative bg-black aspect-[16/9]">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />

                            {/* Text */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h3 className="text-white font-black text-3xl md:text-4xl tracking-wider">
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
