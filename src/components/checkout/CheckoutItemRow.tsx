'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { CartItem } from '@/types';
import { formatINR, getCartItemImage } from '@/lib/shippingUtils';
import { getMaxAllowedQuantity, getQuantityLimitMessage } from '@/constants/cart';

interface CheckoutItemRowProps {
  item: CartItem;
  stockQuantity: number;
  onRemove: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
  onLimitReached?: (message: string) => void;
}

export default function CheckoutItemRow({
  item,
  stockQuantity,
  onRemove,
  onDecrease,
  onIncrease,
  onLimitReached,
}: CheckoutItemRowProps) {
  const lineTotal = item.product.price * item.quantity;
  const maxAllowed = getMaxAllowedQuantity(stockQuantity);
  const atMax = item.quantity >= maxAllowed;
  const limitMessage = getQuantityLimitMessage(item.quantity, stockQuantity);
  const canIncrease = !atMax && stockQuantity > 0;

  const handleIncrease = () => {
    if (!canIncrease) {
      const msg = getQuantityLimitMessage(maxAllowed, stockQuantity);
      if (msg) onLimitReached?.(msg);
      return;
    }
    onIncrease();
  };

  return (
    <div className="py-5 first:pt-0 last:pb-0 flex gap-4 border-b border-amber-100/80 last:border-0">
      <Link
        href={`/products/${item.productId}`}
        className="relative w-20 h-28 sm:w-24 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-200"
      >
        <Image src={getCartItemImage(item)} alt={item.product.name} fill className="object-cover" unoptimized />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link href={`/products/${item.productId}`}>
              <p className="text-sm font-bold text-heading line-clamp-2 hover:text-amber-900 transition-colors">
                {item.product.name}
              </p>
            </Link>
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[10px] font-semibold text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
              Size: {item.size}
            </span>
            <span className="text-[10px] font-semibold text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
              Color: {item.color}
            </span>
          </div>

          {limitMessage && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/70 rounded-lg px-2.5 py-1.5 w-fit">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {limitMessage}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 gap-3">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={onDecrease}
              className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-heading">{item.quantity}</span>
            <button
              type="button"
              onClick={handleIncrease}
              disabled={!canIncrease}
              className="p-2 hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-heading">{formatINR(lineTotal)}</p>
            {item.quantity > 1 && (
              <p className="text-[10px] text-gray-400">{formatINR(item.product.price)} each</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
