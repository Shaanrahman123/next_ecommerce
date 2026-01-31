'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface Review {
    id: string;
    name: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
}

interface ProductReviewsProps {
    productId: string;
    averageRating: number;
    totalReviews: number;
}

export default function ProductReviews({ productId, averageRating, totalReviews }: ProductReviewsProps) {
    const [reviews] = useState<Review[]>([
        {
            id: '1',
            name: 'John Doe',
            rating: 5,
            date: '2 days ago',
            comment: 'Excellent quality! The fit is perfect and the material feels premium. Highly recommended!',
            verified: true,
        },
        {
            id: '2',
            name: 'Jane Smith',
            rating: 4,
            date: '1 week ago',
            comment: 'Great product overall. The color is exactly as shown in the pictures. Very satisfied with my purchase.',
            verified: true,
        },
        {
            id: '3',
            name: 'Mike Johnson',
            rating: 5,
            date: '2 weeks ago',
            comment: 'Amazing! This exceeded my expectations. The quality is top-notch and it arrived quickly.',
            verified: false,
        },
    ]);

    const ratingDistribution = [
        { stars: 5, count: 45, percentage: 75 },
        { stars: 4, count: 10, percentage: 17 },
        { stars: 3, count: 3, percentage: 5 },
        { stars: 2, count: 1, percentage: 2 },
        { stars: 1, count: 1, percentage: 1 },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-section-title text-gray-900 mb-8">Customer Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Rating Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 text-center">
                        <div className="text-6xl font-bold text-gray-900 mb-2">{averageRating}</div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${i < Math.floor(averageRating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-body text-gray-600">Based on {totalReviews} reviews</p>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="lg:col-span-2">
                    <div className="space-y-3">
                        {ratingDistribution.map((item) => (
                            <div key={item.stars} className="flex items-center gap-4">
                                <div className="flex items-center gap-1 w-20">
                                    <span className="text-small font-medium text-gray-900">{item.stars}</span>
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                </div>
                                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                                <span className="text-small text-gray-600 w-16 text-right">{item.count} reviews</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-card-title text-gray-900">{review.name}</h4>
                                    {review.verified && (
                                        <span className="bg-green-100 text-green-700 text-small px-2 py-0.5 rounded-full font-medium">
                                            Verified Purchase
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-small text-gray-500">{review.date}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-body text-gray-700">{review.comment}</p>
                    </div>
                ))}
            </div>

            {/* Write Review Button */}
            <div className="mt-8 text-center">
                <button className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300">
                    Write a Review
                </button>
            </div>
        </div>
    );
}
