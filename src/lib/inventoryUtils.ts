export const LOW_STOCK_THRESHOLD = 10;

export type StockFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'inactive';

export interface StockStatusInfo {
  status: StockFilter | 'in_stock';
  label: string;
  className: string;
}

export function getStockStatus(product: {
  inStock: boolean;
  stockQuantity: number;
  isActive: boolean;
}): StockStatusInfo {
  if (!product.isActive) {
    return { status: 'inactive', label: 'Inactive', className: 'bg-gray-100 text-gray-500' };
  }
  if (!product.inStock || product.stockQuantity === 0) {
    return { status: 'out_of_stock', label: 'Out of Stock', className: 'bg-red-50 text-red-600' };
  }
  if (product.stockQuantity <= LOW_STOCK_THRESHOLD) {
    return { status: 'low_stock', label: 'Low Stock', className: 'bg-orange-50 text-orange-600' };
  }
  return { status: 'in_stock', label: 'In Stock', className: 'bg-emerald-50 text-emerald-600' };
}

export function buildStockFilterQuery(stockFilter: StockFilter): Record<string, unknown> {
  switch (stockFilter) {
    case 'inactive':
      return { isActive: false };
    case 'out_of_stock':
      return { isActive: true, $or: [{ inStock: false }, { stockQuantity: 0 }] };
    case 'low_stock':
      return {
        isActive: true,
        inStock: true,
        stockQuantity: { $gt: 0, $lte: LOW_STOCK_THRESHOLD },
      };
    case 'in_stock':
      return { isActive: true, inStock: true, stockQuantity: { $gt: LOW_STOCK_THRESHOLD } };
    default:
      return {};
  }
}
