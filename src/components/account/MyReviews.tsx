'use client';

import { Star } from 'lucide-react';

export default function MyReviews() {
    const reviews = [
        {
            id: '1',
            product: 'Premium Wireless Headphones',
            rating: 5,
            date: 'Dec 10, 2025',
            comment: 'Excellent sound quality! Very comfortable to wear for long periods.',
        },
        {
            id: '2',
            product: 'Smart Watch Series 5',
            rating: 4,
            date: 'Nov 28, 2025',
            comment: 'Great features and battery life. The display is crisp and clear.',
        },
    ];

    return (
        <div className="animate-fade-in text-full">
            <div className="hidden lg:block mb-10">
                <h1 className="text-section-title font-black text-gray-900 mb-2 uppercase tracking-tight">My Reviews</h1>
                <p className="text-body text-gray-600">Your product reviews and ratings</p>
            </div>

            <div className="divide-y divide-gray-300 lg:space-y-6 lg:divide-y-0 text-full px-1">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="py-6 lg:bg-white lg:border lg:border-gray-300 lg:rounded-md lg:p-8 transition-all duration-300 group cursor-pointer"
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-body font-black text-gray-900 uppercase tracking-tight mb-3 group-hover:text-black transition-colors">{review.product}</h3>
                                <div className="flex items-center gap-1.5 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating
                                                ? 'fill-black text-black'
                                                : 'text-gray-200'
                                                }`}
                                        />
                                    ))}
                                    <span className="ml-2 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">{review.rating}.0 / 5.0</span>
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">{review.date}</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gray-50 rounded-full hidden md:block" />
                            <p className="text-body text-gray-600 leading-relaxed">"{review.comment}"</p>
                        </div>
                    </div>
                ))}
            </div>

            {reviews.length === 0 && (
                <div className="text-center py-24 bg-gray-50 rounded-md border border-dashed border-gray-300">
                    <div className="w-20 h-20 bg-white rounded-md flex items-center justify-center mx-auto mb-6">
                        <Star className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-body font-black text-gray-900 mb-2 uppercase tracking-tight">No reviews yet</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Share your thoughts on products you've purchased.</p>
                </div>
            )}
        </div>
    );
}
