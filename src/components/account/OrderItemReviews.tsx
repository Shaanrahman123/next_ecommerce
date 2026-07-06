'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, Loader2, CheckCircle, Camera, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { reviewService } from '@/services/review.service';
import type { OrderSummary } from '@/types/order';
import type { ProductReview } from '@/types/review';

interface OrderItemReviewsProps {
  order: OrderSummary;
  onReviewSubmitted?: () => void;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={`w-7 h-7 ${star <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewDisplay({ review }: { review: ProductReview }) {
  return (
    <div className="mt-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 p-3">
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-xs font-bold text-emerald-800 ml-2 flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          Review submitted
        </span>
      </div>
      {review.title && <p className="text-sm font-bold text-heading mb-1">{review.title}</p>}
      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {review.images.map((img, idx) => (
            <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-emerald-200/60 bg-white">
              <Image src={img} alt={`Review photo ${idx + 1}`} fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      )}
      <p className="text-[10px] text-gray-400 mt-2">
        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function OrderItemReviews({ order, onReviewSubmitted }: OrderItemReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canReviewAny = order.status === 'delivered';

  useEffect(() => {
    if (!canReviewAny) {
      setIsLoading(false);
      return;
    }
    reviewService
      .listForOrder(order._id)
      .then((res) => setReviews(res.data || []))
      .catch(() => setReviews([]))
      .finally(() => setIsLoading(false));
  }, [order._id, canReviewAny]);

  if (!canReviewAny) return null;

  const getReview = (productId: string, size: string, color: string) =>
    reviews.find((r) => r.productId === productId && r.size === size && r.color === color);

  const handleSubmit = async (productId: string, size: string, color: string) => {
    if (rating < 1) {
      setError('Please select a star rating');
      return;
    }
    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await reviewService.createReview({
        orderId: order._id,
        productId,
        size,
        color,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        images: reviewImages,
      });
      const res = await reviewService.listForOrder(order._id);
      setReviews(res.data || []);
      setActiveKey(null);
      setRating(0);
      setTitle('');
      setComment('');
      setReviewImages([]);
      onReviewSubmitted?.();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Could not submit review';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = 3 - reviewImages.length;
    const selected = files.slice(0, remaining);
    try {
      const encoded = await Promise.all(selected.map(fileToBase64));
      setReviewImages((prev) => [...prev, ...encoded].slice(0, 3));
    } catch {
      setError('Could not read image file');
    }
    e.target.value = '';
  };

  const pendingItems = order.items.filter((item) => !getReview(item.productId, item.size, item.color));
  if (!pendingItems.length && !reviews.length) return null;

  return (
    <div className="rounded-2xl border border-amber-200/70 bg-white overflow-hidden shadow-sm mt-5">
      <div className="px-4 sm:px-5 py-3.5 border-b border-amber-100/80 bg-[#faf8f5]">
        <h2 className="text-xs font-bold text-heading uppercase tracking-wider">Rate &amp; Review Products</h2>
        <p className="text-xs text-gray-500 mt-0.5">Share your experience with items from this order</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-amber-600/50" />
        </div>
      ) : (
        <div className="divide-y divide-amber-100/80">
          {order.items.map((item) => {
            const key = `${item.productId}-${item.size}-${item.color}`;
            const existing = getReview(item.productId, item.size, item.color);
            const isEditing = activeKey === key;

            return (
              <div key={key} className="p-4 sm:p-5">
                <div className="flex gap-3 sm:gap-4">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-amber-200/60 bg-gray-50 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-heading line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {item.size} · Color: {item.color}
                    </p>

                    {existing ? (
                      <ReviewDisplay review={existing} />
                    ) : (
                      <>
                        {!isEditing ? (
                          <Button
                            variant="premium-outline"
                            size="sm"
                            onClick={() => {
                              setActiveKey(key);
                              setRating(0);
                              setTitle('');
                              setComment('');
                              setReviewImages([]);
                              setError('');
                            }}
                            className="mt-3 uppercase tracking-wider text-[10px]"
                          >
                            Rate this product
                          </Button>
                        ) : (
                          <div className="mt-4 space-y-3 rounded-xl border border-amber-200/60 bg-amber-50/30 p-4">
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Your rating
                              </p>
                              <StarPicker value={rating} onChange={setRating} />
                            </div>
                            <input
                              type="text"
                              placeholder="Review title (optional)"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400/40 bg-white"
                            />
                            <textarea
                              placeholder="Share details about fit, quality, and what you liked or didn't like..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400/40 resize-none bg-white"
                            />
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Add photos (optional, up to 3)
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {reviewImages.map((img, idx) => (
                                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-amber-200">
                                    <Image src={img} alt={`Upload ${idx + 1}`} fill className="object-cover" unoptimized />
                                    <button
                                      type="button"
                                      onClick={() => setReviewImages((prev) => prev.filter((_, i) => i !== idx))}
                                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                {reviewImages.length < 3 && (
                                  <label className="w-16 h-16 rounded-lg border-2 border-dashed border-amber-200 bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-amber-50/50 transition-colors">
                                    <Camera className="w-5 h-5 text-amber-700" />
                                    <span className="text-[9px] font-bold text-amber-800 mt-0.5">Add</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
                                  </label>
                                )}
                              </div>
                            </div>
                            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                variant="premium"
                                size="sm"
                                onClick={() => handleSubmit(item.productId, item.size, item.color)}
                                isLoading={isSubmitting}
                                className="uppercase tracking-wider text-[10px] flex-1"
                              >
                                Submit Review
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveKey(null)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
