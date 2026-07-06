'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, Star, Eye, EyeOff } from 'lucide-react';
import { reviewService } from '@/services/review.service';
import type { ProductReview } from '@/types/review';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await reviewService.admin.listReviews(statusFilter || undefined);
      setReviews(res.data || []);
    } catch {
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const toggleStatus = async (review: ProductReview) => {
    setUpdatingId(review._id);
    try {
      const next = review.status === 'published' ? 'hidden' : 'published';
      await reviewService.admin.updateReviewStatus(review._id, next);
      fetchReviews();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading font-heading">Customer Reviews</h1>
        <p className="text-gray-500">Moderate product reviews submitted from delivered orders</p>
      </div>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-2.5 border border-gray-100 rounded-xl text-sm bg-white"
      >
        <option value="">All reviews</option>
        <option value="published">Published</option>
        <option value="hidden">Hidden</option>
      </select>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No reviews found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {reviews.map((review) => (
              <div key={review._id} className="p-5 flex flex-col sm:flex-row gap-4">
                <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100 border shrink-0">
                  <Image src={review.productImage} alt={review.productName} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-bold text-heading">{review.productName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {review.userName || 'Customer'} · Order {review.orderNumber}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        review.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  {review.title && <p className="text-sm font-semibold text-heading mb-1">{review.title}</p>}
                  <p className="text-sm text-gray-600">{review.comment}</p>
                  <p className="text-[10px] text-gray-400 mt-2">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleString('en-IN')
                      : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleStatus(review)}
                  disabled={updatingId === review._id}
                  className="self-start sm:self-center flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {updatingId === review._id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : review.status === 'published' ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Publish
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
