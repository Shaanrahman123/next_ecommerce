import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, CartItem, WishlistItem, Product } from '@/types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
    signup: (user: User) => void;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: string, size: string, color: string) => void;
    updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

interface WishlistState {
    items: WishlistItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),
            signup: (user) => set({ user, isAuthenticated: true }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const items = get().items;
                const existingItemIndex = items.findIndex(
                    (i) =>
                        i.productId === item.productId &&
                        i.size === item.size &&
                        i.color === item.color
                );

                if (existingItemIndex > -1) {
                    const newItems = [...items];
                    newItems[existingItemIndex].quantity += item.quantity;
                    set({ items: newItems });
                } else {
                    set({ items: [...items, item] });
                }
            },
            removeItem: (productId, size, color) =>
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            !(
                                item.productId === productId &&
                                item.size === size &&
                                item.color === color
                            )
                    ),
                })),
            updateQuantity: (productId, size, color, quantity) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.productId === productId &&
                            item.size === size &&
                            item.color === color
                            ? { ...item, quantity }
                            : item
                    ),
                })),
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                const items = get().items;
                return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
            },
            getItemCount: () => {
                const items = get().items;
                return items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                const items = get().items;
                const exists = items.find((item) => item.productId === product.id);
                if (!exists) {
                    set({
                        items: [
                            ...items,
                            { productId: product.id, product, addedAt: new Date() },
                        ],
                    });
                }
            },
            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.productId !== productId),
                })),
            isInWishlist: (productId) => {
                const items = get().items;
                return items.some((item) => item.productId === productId);
            },
            clearWishlist: () => set({ items: [] }),
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
