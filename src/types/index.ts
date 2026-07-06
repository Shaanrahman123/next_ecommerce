export * from './auth';
export * from './api';
export * from './user';
export * from './cart';

export const LOGIN_TYPES = {
  DIRECT: 'direct',
  SOCIAL: 'social'
} as const;

export type LoginType = typeof LOGIN_TYPES[keyof typeof LOGIN_TYPES];

export interface User {
    id: string;
    email: string;
    name: string;
    password?: string;
    createdAt: Date;
    loginType?: LoginType;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: string;
    gender: 'men' | 'women' | 'unisex';
    sizes: string[];
    colors: string[];
    inStock: boolean;
    stockQuantity?: number;
    soldQuantity?: number;
    returnDays?: number;
    isReturnable?: boolean;
    featured?: boolean;
    rating?: number;
    reviews?: number;
}

export interface CartItem {
    productId: string;
    product: Product;
    quantity: number;
    size: string;
    color: string;
}

export interface WishlistItem {
    productId: string;
    product: Product;
    addedAt: Date;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: Address;
    paymentMethod: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Address {
    id: string;
    type?: string;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email?: string;
    isDefault?: boolean;
}

export interface PaymentDetails {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
}
