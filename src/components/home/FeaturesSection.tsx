'use client';

import { Award, CreditCard, Truck } from 'lucide-react';

const features = [
    {
        id: 1,
        icon: Award,
        title: 'BEST QUALITY',
        description: 'Premium products guaranteed',
    },
    {
        id: 2,
        icon: CreditCard,
        title: 'SECURED PAYMENT',
        description: '100% secure transactions',
    },
    {
        id: 3,
        icon: Truck,
        title: 'FREE SHIPPING',
        description: 'On orders above ₹999',
    },
];

export default function FeaturesSection() {
    return (
        <section className="py-8 px-8 lg:px-16 xl:px-24 container mx-auto border-t border-gray-200">
            <div className="grid grid-cols-3 gap-2 md:gap-8">
                {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={feature.id}
                            className="flex flex-col items-center text-center p-2"
                        >
                            <div className="mb-2 md:mb-4">
                                <Icon className="w-8 h-8 md:w-12 md:h-12 text-gray-900 stroke-[1.5]" />
                            </div>
                            <h3 className="text-[10px] md:text-sm font-bold text-gray-900 uppercase tracking-wide mb-1 md:mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-[9px] md:text-xs text-gray-600 hidden md:block">
                                {feature.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
