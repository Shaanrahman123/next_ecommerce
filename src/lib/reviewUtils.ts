import mongoose from 'mongoose';
import Review from '@/models/Review';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { uploadMultipleImages } from '@/lib/cloudinary';
import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';

export class ReviewError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode = 400, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export async function syncProductRating(productId: string) {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId), status: 'published' } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  const avg = stats[0]?.avgRating ?? 0;
  const count = stats[0]?.count ?? 0;

  await Product.findByIdAndUpdate(productId, {
    ratings: Math.round(avg * 10) / 10,
    reviewsCount: count,
  });
}

export async function createProductReview(
  userId: string,
  payload: {
    orderId: string;
    productId: string;
    size: string;
    color: string;
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
  }
) {
  const { orderId, productId, size, color, rating, title, comment, images } = payload;

  if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new ReviewError('Invalid order or product', 400, 'INVALID_ID');
  }

  const order = await Order.findOne({ _id: orderId, user: userId }).lean();
  if (!order) throw new ReviewError('Order not found', 404, 'NOT_FOUND');

  if (order.status !== 'delivered') {
    throw new ReviewError('You can review products only after delivery', 400, 'NOT_DELIVERED');
  }

  const lineItem = order.items.find(
    (i) =>
      String(i.productId) === productId &&
      i.size === size &&
      i.color === color
  );
  if (!lineItem) {
    throw new ReviewError('Product not found in this order', 400, 'INVALID_ITEM');
  }

  const existing = await Review.findOne({ user: userId, order: orderId, product: productId, size, color });
  if (existing) throw new ReviewError('You already reviewed this item', 400, 'ALREADY_REVIEWED');

  const stars = Math.floor(Number(rating));
  if (stars < 1 || stars > 5) throw new ReviewError('Rating must be between 1 and 5', 400, 'INVALID_RATING');

  const trimmedComment = comment.trim();
  if (trimmedComment.length < 10) {
    throw new ReviewError('Please write at least 10 characters in your review', 400, 'INVALID_COMMENT');
  }

  let uploadedImages: string[] = [];
  if (images?.length) {
    const toUpload = images.slice(0, 3).filter((img) => typeof img === 'string' && img.startsWith('data:'));
    if (toUpload.length) {
      try {
        uploadedImages = await uploadMultipleImages(toUpload, 'reviews');
      } catch {
        throw new ReviewError(
          'Could not upload photos. Submit without images or try again later.',
          400,
          'UPLOAD_FAILED'
        );
      }
    }
  }

  const review = await Review.create({
    user: userId,
    product: productId,
    order: orderId,
    orderNumber: order.orderNumber,
    productName: lineItem.name,
    productImage: lineItem.image,
    size,
    color,
    rating: stars,
    title: title?.trim() || '',
    comment: trimmedComment,
    images: uploadedImages,
    status: 'published',
  });

  await syncProductRating(productId);

  return review.toObject();
}

export function serializeReview(doc: Record<string, unknown>, userName?: string) {
  const rawImages = (doc.images as string[] | undefined) || [];
  const images = rawImages.map((id) =>
    getCloudinaryUrl(id, { width: 600, height: 600, crop: 'limit' })
  );

  return {
    _id: String(doc._id),
    productId: String(doc.product),
    orderId: String(doc.order),
    orderNumber: String(doc.orderNumber),
    productName: String(doc.productName),
    productImage: String(doc.productImage),
    size: String(doc.size),
    color: String(doc.color),
    rating: Number(doc.rating),
    title: String(doc.title || ''),
    comment: String(doc.comment),
    images,
    status: doc.status,
    userName,
    createdAt: doc.createdAt ? new Date(doc.createdAt as string).toISOString() : undefined,
  };
}

export async function getProductPublishedReviews(productId: string) {
  if (!mongoose.Types.ObjectId.isValid(productId)) return [];

  const reviews = await Review.find({ product: productId, status: 'published' })
    .sort({ createdAt: -1 })
    .populate('user', 'firstName lastName')
    .lean();

  return reviews.map((r) => {
    const user = r.user as { firstName?: string; lastName?: string } | undefined;
    const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Verified Buyer';
    return serializeReview(r as unknown as Record<string, unknown>, userName);
  });
}
