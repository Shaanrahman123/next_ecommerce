'use client';

import Link from 'next/link';
import { Tag, TrendingUp, Zap, Gift } from 'lucide-react';

const offers = [
    {
        id: 1,
        icon: Tag,
        title: 'FLAT 50% OFF',
        description: 'On First Purchase',
        bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
        textColor: 'text-gray-900',
        iconBg: 'bg-gray-200',
        link: '/products?offer=first-purchase',
    },
    {
        id: 2,
        icon: TrendingUp,
        title: 'BUY 2 GET 1',
        description: 'On Selected Items',
        bgColor: 'bg-gradient-to-br from-slate-50 to-slate-100',
        textColor: 'text-slate-900',
        iconBg: 'bg-slate-200',
        link: '/products?offer=buy2get1',
    },
    {
        id: 3,
        icon: Zap,
        title: 'FLASH SALE',
        description: 'Up to 70% OFF',
        bgColor: 'bg-gradient-to-br from-stone-50 to-stone-100',
        textColor: 'text-stone-900',
        iconBg: 'bg-stone-200',
        link: '/products?offer=flash-sale',
    },
    {
        id: 4,
        icon: Gift,
        title: 'FREE SHIPPING',
        description: 'On Orders Above ₹999',
        bgColor: 'bg-gradient-to-br from-zinc-50 to-zinc-100',
        textColor: 'text-zinc-900',
        iconBg: 'bg-zinc-200',
        link: '/products',
    },
];

export default function OffersSection() {
    return (
        <section className="py-6 px-4 lg:px-4 xl:px-4 container mx-auto">
            {/* Header */}
            <div className="text-center mb-4 lg:mb-8">
                <h2 className="text-[10px] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-black text-gray-900 mb-1 uppercase tracking-tight">
                    SPECIAL OFFERS
                </h2>
                <p className="text-[8px] text-gray-600">Limited time deals you don't want to miss</p>
                <div className="h-0.5 w-12 md:w-24 bg-gray-900 mx-auto mt-2 md:mt-4" />
            </div>

            {/* Offers Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {offers.map((offer) => {
                    const Icon = offer.icon;
                    return (
                        <Link
                            key={offer.id}
                            href={offer.link}
                            className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200"
                        >
                            <div className={`${offer.bgColor} p-3 md:p-8 h-full flex flex-col items-center justify-center text-center space-y-1.5 md:space-y-4`}>
                                <div className={`${offer.iconBg} p-1.5 md:p-4 rounded-full group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`w-4 h-4 md:w-10 md:h-10 ${offer.textColor}`} />
                                </div>
                                <h3 className={`text-[10px] md:text-2xl font-black tracking-tight ${offer.textColor}`}>
                                    {offer.title}
                                </h3>
                                <p className={`text-[8px] md:text-base font-medium ${offer.textColor} opacity-70`}>
                                    {offer.description}
                                </p>
                                <button className="mt-1 text-[8px] md:text-sm bg-gray-900 text-white px-3 py-1 md:px-6 md:py-2 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300">
                                    Shop Now
                                </button>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
