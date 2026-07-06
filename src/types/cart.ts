/** Live product snapshot from API for cart / checkout display */
export interface CartProductSnapshot {
  stockQuantity: number;
  inStock: boolean;
  soldQuantity: number;
  name: string;
  price: number;
  originalPrice?: number;
  returnDays: number;
  isReturnable: boolean;
  heroImageUrl: string;
  images: string[];
}
