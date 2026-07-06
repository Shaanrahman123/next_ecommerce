'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MessageSquare, Camera } from 'lucide-react';
import { reviewService } from '@/services/review.service';
import type { ProductReview } from '@/types/review';

interface ProductCustomerReviewsProps {
  productId: string;
  averageRating?: number;
  totalReviews?: number;
}

function ReviewsSkeleton() {
  return (
    <div className="rounded-2xl border border-amber-200/70 bg-white overflow-hidden shadow-sm animate-pulse">
      <div className="px-5 sm:px-6 py-4 border-b border-amber-100/80 bg-[#faf8f5]">
        <div className="h-4 w-40 bg-amber-100 rounded" />
      </div>
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-amber-100/80">
          <div className="rounded-xl bg-amber-50/40 border border-amber-100 p-5 flex flex-col items-center gap-3">
            <div className="h-10 w-16 bg-amber-100 rounded" />
            <div className="h-4 w-24 bg-amber-100 rounded" />
            <div className="h-3 w-28 bg-amber-50 rounded" />
          </div>
          <div className="md:col-span-2 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-3 w-3 bg-gray-100 rounded" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full" />
                <div className="h-3 w-6 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 pb-5 border-b border-amber-50 last:border-0">
              <div className="w-12 h-14 rounded-lg bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-3 w-full bg-gray-50 rounded" />
                <div className="h-3 w-5/6 bg-gray-50 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-gray-700 w-3">{stars}</span>
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
    </div>
  );
}

export default function ProductCustomerReviews({
  productId,
  averageRating = 0,
  totalReviews = 0,
}: ProductCustomerReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reviewService
      .listForProduct(productId)
      .then((res) => setReviews(res.data || []))
      .catch(() => setReviews([]))
      .finally(() => setIsLoading(false));
  }, [productId]);

  const distribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: reviews.filter((r) => r.rating === stars).length,
    }));
  }, [reviews]);

  const displayRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : averageRating;
  const displayCount = reviews.length || totalReviews;

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  return (
    <div className="rounded-2xl border border-amber-200/70 bg-white overflow-hidden shadow-sm">
      <div className="px-5 sm:px-6 py-4 border-b border-amber-100/80 bg-[#faf8f5]">
        <h2 className="text-sm font-bold text-heading uppercase tracking-wider">Ratings &amp; Reviews</h2>
      </div>

      <div className="p-5 sm:p-6">
        {displayCount === 0 ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-7 h-7 text-amber-400" />
            </div>
            <p className="text-sm font-semibold text-heading mb-1">No reviews yet</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Reviews appear here after verified buyers rate their delivered orders.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-amber-100/80">
              <div className="flex flex-col items-center justify-center rounded-xl bg-amber-50/40 border border-amber-100 p-5">
                <span className="text-4xl font-black text-heading">{displayRating.toFixed(1)}</span>
                <div className="flex items-center gap-0.5 my-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= Math.round(displayRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 font-medium">{displayCount} verified reviews</p>
              </div>
              <div className="md:col-span-2 space-y-2.5">
                {distribution.map((d) => (
                  <RatingBar key={d.stars} stars={d.stars} count={d.count} total={reviews.length} />
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-amber-50 pb-5 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-amber-100 bg-gray-50 shrink-0">
                      <Image
                        src={review.productImage}
                        alt={review.productName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded uppercase">
                          Verified Purchase
                        </span>
                      </div>
                      {review.title && (
                        <p className="text-sm font-bold text-heading mb-1">{review.title}</p>
                      )}
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>

                      {review.images && review.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {review.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative w-16 h-16 rounded-lg overflow-hidden border border-amber-100 bg-gray-50"
                            >
                              <Image src={img} alt={`Review photo ${idx + 1}`} fill className="object-cover" unoptimized />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-gray-400">
                        <span className="font-semibold text-gray-600">{review.userName || 'Verified Buyer'}</span>
                        <span>·</span>
                        <span>
                          {review.size} · {review.color}
                        </span>
                        <span>·</span>
                        <span>
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 pt-5 border-t border-amber-100/80 flex items-center gap-2 text-xs text-gray-500">
          <Camera className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Purchased this item?{' '}
            <Link href="/account?section=orders" className="text-amber-800 font-semibold hover:underline">
              Rate it from your orders
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
