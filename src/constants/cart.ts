/** Max quantity per line item in cart / checkout */
export const MAX_CART_ITEM_QUANTITY = 5;

export function getMaxAllowedQuantity(stockQuantity: number): number {
  const stock = Math.max(0, stockQuantity);
  return Math.min(MAX_CART_ITEM_QUANTITY, stock);
}

export function getQuantityLimitMessage(quantity: number, stockQuantity: number): string | null {
  const max = getMaxAllowedQuantity(stockQuantity);
  if (quantity < max) return null;
  if (stockQuantity < MAX_CART_ITEM_QUANTITY) {
    return `Only ${stockQuantity} left in stock`;
  }
  return `Maximum ${MAX_CART_ITEM_QUANTITY} units per product`;
}
