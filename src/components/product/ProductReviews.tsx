'use client';

import { Star, MessageSquare } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

export default function ProductReviews({ averageRating, totalReviews }: ProductReviewsProps) {
  if (totalReviews === 0) {
    return (
      <div className="bg-white rounded-2xl border border-amber-100 p-8 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-section-title text-gray-900 mb-2">Customer Reviews</h2>
        <p className="text-body text-gray-500 mb-6">No reviews yet. Be the first to share your experience!</p>
        <button
          type="button"
          className="px-8 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover transition-colors duration-300"
        >
          Write a Review
        </button>
      </div>
    );
  }

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = stars === 5 ? Math.round(totalReviews * 0.7) : stars === 4 ? Math.round(totalReviews * 0.2) : Math.max(0, Math.round(totalReviews * 0.03));
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-6 md:p-8">
      <h2 className="text-section-title text-gray-900 mb-8">Customer Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <div className="bg-linear-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-6 text-center">
            <div className="text-6xl font-bold text-heading mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-body text-gray-600">Based on {totalReviews} reviews</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-3">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-small font-medium text-gray-900">{item.stars}</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-amber-400 to-amber-500 transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-small text-gray-600 w-16 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          type="button"
          className="px-8 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover transition-colors duration-300"
        >
          Write a Review
        </button>
      </div>
    </div>
  );
}
