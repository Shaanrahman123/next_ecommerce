'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, Loader2 } from 'lucide-react';
import { reviewService } from '@/services/review.service';
import type { ProductReview } from '@/types/review';

export default function MyReviews() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reviewService
      .listMine()
      .then((res) => setReviews(res.data || []))
      .catch(() => setReviews([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600/50" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in text-full">
      <div className="hidden lg:block mb-10">
        <h1 className="text-section-title font-black text-heading mb-2 uppercase tracking-tight">My Reviews</h1>
        <p className="text-body text-gray-600">Your product reviews and ratings</p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-md border border-dashed border-gray-300">
          <div className="w-20 h-20 bg-white rounded-md flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-gray-200" />
          </div>
          <h3 className="text-body font-black text-heading mb-2 uppercase tracking-tight">No reviews yet</h3>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Rate products from your delivered orders to see them here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-300 lg:space-y-6 lg:divide-y-0 text-full px-1">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="py-6 lg:bg-white lg:border lg:border-gray-300 lg:rounded-md lg:p-8 transition-all duration-300"
            >
              <div className="flex gap-4">
                <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                  <Image src={review.productImage} alt={review.productName} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-body font-black text-heading uppercase tracking-tight mb-2 line-clamp-2">
                        {review.productName}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        Order {review.orderNumber} · {review.size} · {review.color}
                      </p>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                          />
                        ))}
                        <span className="ml-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {review.rating}.0 / 5.0
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  {review.title && (
                    <p className="text-sm font-bold text-heading mb-1">{review.title}</p>
                  )}
                  <p className="text-body text-gray-600 leading-relaxed">{review.comment}</p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {review.images.map((img, idx) => (
                        <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                          <Image src={img} alt={`Review photo ${idx + 1}`} fill className="object-cover" unoptimized />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
