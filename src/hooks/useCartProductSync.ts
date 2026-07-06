'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCartStore } from '@/store';
import { orderService } from '@/services/order.service';
import { getMaxAllowedQuantity, MAX_CART_ITEM_QUANTITY } from '@/constants/cart';
import type { CartItem } from '@/types';
import type { CartProductSnapshot } from '@/types/cart';

export function useCartProductSync() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const syncCartProducts = useCartStore((s) => s.syncCartProducts);

  const [productMap, setProductMap] = useState<Record<string, CartProductSnapshot>>({});
  const [isLoading, setIsLoading] = useState(false);

  const productIdsKey = useMemo(
    () =>
      [...new Set(items.map((i) => i.productId))]
        .sort()
        .join(','),
    [items]
  );

  useEffect(() => {
    const ids = productIdsKey ? productIdsKey.split(',') : [];
    if (!ids.length) {
      setProductMap({});
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    orderService
      .fetchCartProducts(ids)
      .then((data) => {
        if (cancelled) return;
        setProductMap(data);
        syncCartProducts(data);
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productIdsKey, syncCartProducts]);

  // Only clamp quantities after API data is loaded — never treat unknown stock as 0
  useEffect(() => {
    if (isLoading || !productIdsKey) return;

    items.forEach((item) => {
      const snap = productMap[item.productId];
      if (!snap) return;

      if (item.quantity < 1) {
        updateQuantity(item.productId, item.size, item.color, 1);
        return;
      }

      const max = getMaxAllowedQuantity(snap.stockQuantity);
      if (max === 0) {
        removeItem(item.productId, item.size, item.color);
      } else if (item.quantity > max) {
        updateQuantity(item.productId, item.size, item.color, max);
      }
    });
  }, [productMap, isLoading, items, removeItem, updateQuantity, productIdsKey]);

  const hydratedItems: CartItem[] = useMemo(
    () =>
      items.map((item) => {
        const snap = productMap[item.productId];
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
            heroImageUrl: snap.heroImageUrl,
          } as CartItem['product'] & { heroImageUrl?: string },
        };
      }),
    [items, productMap]
  );

  const getItemStock = (productId: string): number => {
    const fromApi = productMap[productId]?.stockQuantity;
    if (fromApi != null) return fromApi;
    const cached = items.find((i) => i.productId === productId)?.product.stockQuantity;
    if (cached != null) return cached;
    return MAX_CART_ITEM_QUANTITY;
  };

  return {
    items: hydratedItems,
    isLoading,
    getItemStock,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
