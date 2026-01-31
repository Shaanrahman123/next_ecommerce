export interface User {
    id: string;
    email: string;
    name: string;
    password?: string;
    createdAt: Date;
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
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
}

export interface PaymentDetails {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
}
