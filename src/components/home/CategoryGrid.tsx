'use client';

import Link from 'next/link';
import Image from 'next/image';

const categories = [
    {
        id: 1,
        title: 'Shirts',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
        link: '/products?category=topwear&item=shirts',
        bgColor: 'bg-gradient-to-br from-blue-100 to-blue-50',
    },
    {
        id: 2,
        title: 'T-Shirts',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
        link: '/products?category=topwear&item=t-shirts',
        bgColor: 'bg-gradient-to-br from-orange-100 to-orange-50',
    },
    {
        id: 3,
        title: 'Jeans',
        image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&q=80',
        link: '/products?category=bottomwear&item=jeans',
        bgColor: 'bg-gradient-to-br from-purple-100 to-purple-50',
    },
    {
        id: 4,
        title: 'Shorts & Trousers',
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80',
        link: '/products?category=bottomwear&item=trousers',
        bgColor: 'bg-gradient-to-br from-pink-100 to-pink-50',
    },
    {
        id: 5,
        title: 'Casual Shoes',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
        link: '/products?category=footwear',
        bgColor: 'bg-gradient-to-br from-green-100 to-green-50',
    },
    {
        id: 6,
        title: 'Watches',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80',
        link: '/products?category=accessories&item=watches',
        bgColor: 'bg-gradient-to-br from-red-100 to-red-50',
    },
    {
        id: 7,
        title: 'Kurtas',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
        link: '/products?category=topwear&item=kurtas',
        bgColor: 'bg-gradient-to-br from-yellow-100 to-yellow-50',
    },
    {
        id: 8,
        title: 'Bags',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
        link: '/products?category=accessories&item=bags',
        bgColor: 'bg-gradient-to-br from-indigo-100 to-indigo-50',
    },
];

export default function CategoryGrid() {
    return (
        <section className="py-6 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-4 xl:px-4">
                {/* Section Header */}
                <div className="mb-4 lg:mb-12">
                    <h2 className="text-[10px] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-black text-gray-900 uppercase tracking-tight">
                        Categories To Bag
                    </h2>
                </div>

                {/* Mobile View: Horizontal Scroll */}
                <div className="lg:hidden">
                    <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x ps-4">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={category.link}
                                className="flex flex-col items-center gap-3 min-w-[80px] snap-start group"
                            >
                                <div className={`relative w-20 h-20 rounded-full overflow-hidden ${category.bgColor} p-2 shadow-md group-hover:shadow-xl transition-all duration-300`}>
                                    <div className="relative w-full h-full rounded-full overflow-hidden">
                                        <Image
                                            src={category.image}
                                            alt={category.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                                <span className="text-[8px] font-semibold text-gray-900 text-center leading-tight">
                                    {category.title}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Desktop View: Grid */}
                <div className="hidden lg:grid lg:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={category.link}
                            className="group"
                        >
                            <div className="flex flex-col items-center gap-3">
                                <div className={`relative w-60 h-60 rounded-full overflow-hidden ${category.bgColor} p-4 shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300`}>
                                    <div className="relative w-full h-full rounded-full overflow-hidden">
                                        <Image
                                            src={category.image}
                                            alt={category.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                                <span className="text-base font-semibold text-gray-900 text-center group-hover:text-black transition-colors">
                                    {category.title}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
