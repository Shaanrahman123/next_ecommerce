export type ReviewStatus = 'published' | 'hidden';

export interface ProductReview {
  _id: string;
  productId: string;
  orderId: string;
  orderNumber: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  status: ReviewStatus;
  userName?: string;
  createdAt: string;
}

export interface CreateReviewPayload {
  orderId: string;
  productId: string;
  size: string;
  color: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
}

export interface OrderItemReviewState {
  productId: string;
  size: string;
  color: string;
  canReview: boolean;
  review?: ProductReview;
}
