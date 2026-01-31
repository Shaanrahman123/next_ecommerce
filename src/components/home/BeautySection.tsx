'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

const beautyCategories = [
    {
        id: 1,
        title: 'Premium Fragrances',
        discount: 'Up to 40% OFF',
        description: 'Luxury Perfumes & Deodorants',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        link: '/products?category=fragrances',
    },
    {
        id: 2,
        title: 'Men\'s Skincare',
        discount: 'Up to 50% OFF',
        description: 'Face Wash, Moisturizers & Scrubs',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
        link: '/products?category=skincare',
    },
    {
        id: 3,
        title: 'Hair & Beard Care',
        discount: 'Up to 35% OFF',
        description: 'Beard Oils, Waxes & Trimmers',
        image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80',
        link: '/products?category=grooming',
    },
];

const brands = [
    { name: 'BEARDO', discount: 'Up to 30%' },
    { name: 'THE MAN COMPANY', discount: 'Flat 25%' },
    { name: 'BOMBAY SHAVING', discount: 'Extra 10%' },
    { name: 'CALVIN KLEIN', discount: 'Up to 20%' },
    { name: 'NIKEA', discount: 'New Arrivals' },
    { name: 'PHILIPS', discount: 'Grooming Tech' },
];

export default function BeautySection() {
    return (
        <section className="py-12 px-8 lg:px-16 xl:px-24 container mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-gray-900" />
                    <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight">
                        GROOMING ESSENTIALS
                    </h2>
                    <Sparkles className="w-6 h-6 text-gray-900" />
                </div>
                <p className="text-gray-600 text-lg">Premium care for the modern man</p>
                <div className="h-0.5 w-24 bg-black mx-auto mt-4" />
            </div>

            {/* Main Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {beautyCategories.map((category) => (
                    <Link
                        key={category.id}
                        href={category.link}
                        className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200"
                    >
                        <div className="bg-gray-50 aspect-[4/5] relative">
                            <Image
                                src={category.image}
                                alt={category.title}
                                fill
                                className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end text-center">
                                <h3 className="text-2xl font-bold text-white mb-1">
                                    {category.title}
                                </h3>
                                <p className="text-white font-black text-xl mb-1">
                                    {category.discount}
                                </p>
                                <p className="text-gray-300 text-sm mb-4">
                                    {category.description}
                                </p>
                                <button className="bg-white text-black px-6 py-2 rounded-full font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors duration-300 text-xs">
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Brand Offers */}
            <div className="bg-gray-50 rounded-lg shadow-sm p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center uppercase tracking-wide">
                    Top Grooming Brands
                </h3>
                {/* Scrollable Brands on Mobile */}
                <div className="flex overflow-x-auto gap-4 lg:grid lg:grid-cols-6 pb-4 lg:pb-0 scrollbar-hide snap-x">
                    {brands.map((brand) => (
                        <Link
                            key={brand.name}
                            href={`/products?brand=${brand.name.toLowerCase()}`}
                            className="group bg-white rounded-lg p-6 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-200 min-w-[150px] snap-start"
                        >
                            <h4 className="font-bold text-black mb-1 group-hover:text-gray-700 transition-colors text-sm">
                                {brand.name}
                            </h4>
                            <p className="text-xs text-gray-500 font-semibold">
                                {brand.discount}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
