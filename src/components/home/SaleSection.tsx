'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const saleItems = [
    {
        id: 1,
        title: 'Winter Layers',
        discount: 'MIN 50% OFF',
        description: 'Jackets, Hoodies & Sweatshirts',
        image: 'https://images.unsplash.com/photo-1544652233-a3d240294e5a?w=800&q=80', // Man in winter jacket
        link: '/products?category=topwear&item=sweatshirts',
        tag: 'SEASON END',
    },
    {
        id: 2,
        title: 'Wedding Season',
        discount: '40-70% OFF',
        description: 'Sherwanis, Kurtas & Sets',
        image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800&q=80', // Ethnic wear
        link: '/products?category=topwear&item=ethnic-wear',
        tag: 'WEDDING EDIT',
    },
    {
        id: 3,
        title: 'Sneaker Fest',
        discount: 'UP TO 60% OFF',
        description: 'Top Brands: Nike, Adidas & More',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80', // Sneakers
        link: '/products?category=footwear',
        tag: 'LIMITED TIME',
    },
];

export default function SaleSection() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 12,
        minutes: 30,
        seconds: 45,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-12 px-8 lg:px-16 xl:px-24 container mx-auto bg-linear-to-b from-gray-50 to-white">
            {/* Header with Timer */}
            <div className="text-center mb-10">
                <h2 className="text-page-title font-black text-black mb-4 uppercase tracking-tighter italic transform -skew-x-6">
                    FLASH SALE
                </h2>

                {/* Countdown Timer */}
                <div className="flex items-center justify-center gap-6 mb-6">
                    <Clock className="w-6 h-6 text-red-600 animate-pulse" />
                    <div className="flex gap-3">
                        <div className="bg-black text-white px-4 py-3 rounded-md shadow-lg">
                            <div className="text-3xl font-black font-mono">{String(timeLeft.hours).padStart(2, '0')}</div>
                            <div className="text-[12px] uppercase tracking-widest text-gray-400">Hours</div>
                        </div>
                        <div className="text-4xl font-black flex items-start pt-1 text-black">:</div>
                        <div className="bg-black text-white px-4 py-3 rounded-md shadow-lg">
                            <div className="text-3xl font-black font-mono">{String(timeLeft.minutes).padStart(2, '0')}</div>
                            <div className="text-[12px] uppercase tracking-widest text-gray-400">Mins</div>
                        </div>
                        <div className="text-4xl font-black flex items-start pt-1 text-black">:</div>
                        <div className="bg-black text-white px-4 py-3 rounded-md shadow-lg">
                            <div className="text-3xl font-black font-mono">{String(timeLeft.seconds).padStart(2, '0')}</div>
                            <div className="text-[12px] uppercase tracking-widest text-gray-400">Secs</div>
                        </div>
                    </div>
                </div>

                <div className="h-0.5 w-32 bg-black mx-auto mt-4" />
            </div>

            {/* Sale Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {saleItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.link}
                        className="group relative h-[500px] overflow-hidden rounded-xl shadow-lg border border-gray-100"
                    >
                        {/* Tag */}
                        <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-1.5 font-black text-xs z-10 uppercase tracking-widest transform -skew-x-12">
                            {item.tag}
                        </div>

                        {/* Image */}
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-90" />

                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-section-title font-black uppercase italic mb-1 leading-none">
                                {item.title}
                            </h3>
                            <p className="text-yellow-400 font-black text-4xl mb-2">
                                {item.discount}
                            </p>
                            <p className="text-gray-300 font-medium mb-6">
                                {item.description}
                            </p>
                            <button className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                                Shop Now
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
