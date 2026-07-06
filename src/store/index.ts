import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, CartItem, WishlistItem, Product, Address } from '@/types';
import type { CartProductSnapshot } from '@/types/cart';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
    signup: (user: User) => void;
    setUser: (user: User) => void;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: string, size: string, color: string) => void;
    updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
    syncCartProducts: (snapshots: Record<string, CartProductSnapshot>) => void;
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

interface AddressState {
    addresses: Address[];
    addAddress: (address: Address) => void;
    updateAddress: (id: string, address: Partial<Address>) => void;
    deleteAddress: (id: string) => void;
    setDefaultAddress: (id: string) => void;
    setAddresses: (addresses: Address[]) => void;
    clearAddresses: () => void;
}


export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),
            signup: (user) => set({ user, isAuthenticated: true }),
            setUser: (user) => set({ user, isAuthenticated: true }),
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
            syncCartProducts: (snapshots) =>
                set((state) => ({
                    items: state.items.map((item) => {
                        const snap = snapshots[item.productId];
                        if (!snap) return item;
                        return {
                            ...item,
                            product: {
                                ...item.product,
                                name: snap.name,
                                price: snap.price,
                                originalPrice: snap.originalPrice,
                                inStock: snap.inStock,
                                stockQuantity: snap.stockQuantity,
                                soldQuantity: snap.soldQuantity,
                                returnDays: snap.returnDays,
                                isReturnable: snap.isReturnable,
                                images: snap.images.length ? snap.images : item.product.images,
                            },
                        };
                    }),
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

export const useAddressStore = create<AddressState>()(
    persist(
        (set) => ({
            addresses: [],
            addAddress: (address) =>
                set((state) => ({ addresses: [...state.addresses, address] })),
            updateAddress: (id, updatedAddress) =>
                set((state) => ({
                    addresses: state.addresses.map((a) =>
                        a.id === id ? { ...a, ...updatedAddress } : a
                    ),
                })),
            deleteAddress: (id) =>
                set((state) => ({
                    addresses: state.addresses.filter((a) => a.id !== id),
                })),
            setDefaultAddress: (id) =>
                set((state) => ({
                    addresses: state.addresses.map((a) => ({
                        ...a,
                        isDefault: a.id === id,
                    })),
                })),
            setAddresses: (addresses) => set({ addresses }),
            clearAddresses: () => set({ addresses: [] }),
        }),
        {
            name: 'address-storage',
        }
    )
);
