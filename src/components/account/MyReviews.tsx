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
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
                <p className="text-gray-600">Your product reviews and ratings</p>
            </div>

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg mb-2">{review.product}</h3>
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < review.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
