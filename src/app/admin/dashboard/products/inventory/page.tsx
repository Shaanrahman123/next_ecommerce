'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Loader2,
  Package,
  AlertTriangle,
  PackageX,
  Boxes,
  Minus,
  Plus,
  Check,
  Pencil,
  Download,
  RefreshCw,
} from 'lucide-react';
import { productService, type InventoryStats } from '@/services/product.service';
import { Product } from '@/types/product';
import { getStockStatus, type StockFilter } from '@/lib/inventoryUtils';
import AlertModal from '@/components/ui/AlertModal';

const FILTER_TABS: { id: StockFilter; label: string }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'in_stock', label: 'In Stock' },
  { id: 'low_stock', label: 'Low Stock' },
  { id: 'out_of_stock', label: 'Out of Stock' },
  { id: 'inactive', label: 'Inactive' },
];

function formatUnits(n: number) {
  return n.toLocaleString('en-IN');
}

function exportInventoryCsv(products: Product[]) {
  const headers = ['Name', 'Slug', 'Brand', 'Price', 'Stock', 'In Stock', 'Active'];
  const rows = products.map((p) => [
    p.name,
    p.slug,
    p.brand || '',
    p.price,
    p.stockQuantity,
    p.inStock ? 'Yes' : 'No',
    p.isActive ? 'Yes' : 'No',
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `inventory-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

interface StockEditorProps {
  product: Product;
  onSaved: (updated: Product) => void;
  onError: (message: string) => void;
}

function StockEditor({ product, onSaved, onError }: StockEditorProps) {
  const [quantity, setQuantity] = useState(product.stockQuantity);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dirty = quantity !== product.stockQuantity;

  useEffect(() => {
    setQuantity(product.stockQuantity);
    setSaved(false);
  }, [product._id, product.stockQuantity]);

  const save = async (nextQty: number) => {
    const qty = Math.max(0, nextQty);
    setQuantity(qty);
    if (qty === product.stockQuantity) return;

    setIsSaving(true);
    setSaved(false);
    try {
      const res = await productService.updateStock(product._id, { stockQuantity: qty });
      onSaved(res.data!);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      setQuantity(product.stockQuantity);
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to update stock';
      onError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center border border-gray-100 rounded-xl overflow-hidden bg-white">
        <button
          type="button"
          disabled={isSaving || quantity <= 0}
          onClick={() => save(quantity - 1)}
          className="p-2 hover:bg-gray-50 text-gray-500 disabled:opacity-40 transition-colors"
          aria-label="Decrease stock"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <input
          type="number"
          min={0}
          value={quantity}
          disabled={isSaving}
          onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value, 10) || 0))}
          onBlur={() => dirty && save(quantity)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }
          }}
          className="w-14 text-center text-sm font-semibold text-heading outline-none border-x border-gray-100 py-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          disabled={isSaving}
          onClick={() => save(quantity + 1)}
          className="p-2 hover:bg-gray-50 text-gray-500 disabled:opacity-40 transition-colors"
          aria-label="Increase stock"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {isSaving ? (
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      ) : saved ? (
        <Check className="w-4 h-4 text-emerald-500" />
      ) : dirty ? (
        <button
          type="button"
          onClick={() => save(quantity)}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Save
        </button>
      ) : null}
    </div>
  );
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [alert, setAlert] = useState<{ title: string; message: string; variant?: 'success' | 'warning' } | null>(
    null
  );

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await productService.getInventory({
        page,
        limit: 15,
        search: search || undefined,
        stockFilter,
      });
      setProducts(res.data || []);
      setStats(res.stats ?? null);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalDocs(res.meta?.totalDocs || 0);
    } catch {
      setProducts([]);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, stockFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchInventory, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchInventory, search]);

  const handleFilterChange = (filter: StockFilter) => {
    setStockFilter(filter);
    setPage(1);
  };

  const handleProductUpdated = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    fetchInventory();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await productService.getInventory({
        page: 1,
        limit: 1000,
        search: search || undefined,
        stockFilter,
      });
      const list = res.data || [];
      if (!list.length) {
        setAlert({ title: 'Nothing to export', message: 'No products match the current filters.', variant: 'warning' });
        return;
      }
      exportInventoryCsv(list);
      setAlert({
        title: 'Export complete',
        message: `Downloaded ${list.length} product${list.length === 1 ? '' : 's'} as CSV.`,
        variant: 'success',
      });
    } catch {
      setAlert({ title: 'Export failed', message: 'Could not export inventory. Please try again.', variant: 'warning' });
    } finally {
      setIsExporting(false);
    }
  };

  const statCards = stats
    ? [
        {
          id: 'all' as StockFilter,
          label: 'Total Products',
          value: formatUnits(stats.totalProducts),
          sub: `${formatUnits(stats.totalUnits)} units in warehouse`,
          icon: Package,
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          ring: stockFilter === 'all' ? 'ring-2 ring-primary ring-offset-2' : '',
        },
        {
          id: 'in_stock' as StockFilter,
          label: 'In Stock',
          value: formatUnits(stats.inStock),
          sub: `More than ${stats.lowStockThreshold} units`,
          icon: Boxes,
          iconBg: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
          ring: stockFilter === 'in_stock' ? 'ring-2 ring-emerald-500 ring-offset-2' : '',
        },
        {
          id: 'low_stock' as StockFilter,
          label: 'Low Stock',
          value: formatUnits(stats.lowStock),
          sub: `${stats.lowStockThreshold} units or fewer`,
          icon: AlertTriangle,
          iconBg: 'bg-orange-50',
          iconColor: 'text-orange-600',
          ring: stockFilter === 'low_stock' ? 'ring-2 ring-orange-500 ring-offset-2' : '',
        },
        {
          id: 'out_of_stock' as StockFilter,
          label: 'Out of Stock',
          value: formatUnits(stats.outOfStock),
          sub: 'Needs restocking',
          icon: PackageX,
          iconBg: 'bg-red-50',
          iconColor: 'text-red-600',
          ring: stockFilter === 'out_of_stock' ? 'ring-2 ring-red-500 ring-offset-2' : '',
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading font-heading">Inventory</h1>
          <p className="text-gray-500">
            Track stock levels, spot low inventory, and update quantities without opening each product.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={fetchInventory}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-medium hover:bg-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-medium hover:bg-white transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading && !stats
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse h-28" />
            ))
          : statCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => handleFilterChange(card.id)}
                className={`bg-white p-6 rounded-2xl border border-gray-100 text-left hover:shadow-md transition-all ${card.ring}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
                    <h3 className="text-3xl font-bold text-heading mt-1">{card.value}</h3>
                    <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                  </div>
                  <div className={`p-2 rounded-xl ${card.iconBg}`}>
                    <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                </div>
              </button>
            ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, slug, or brand..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none transition-all w-full lg:w-72"
              />
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {totalDocs} product{totalDocs === 1 ? '' : 's'}
              {stats && stockFilter !== 'all' ? ` · filtered` : ''}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleFilterChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  stockFilter === tab.id
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-white border border-gray-100 text-gray-500 hover:text-heading hover:border-gray-200'
                }`}
              >
                {tab.label}
                {stats && tab.id !== 'all' && (
                  <span className="ml-1.5 opacity-70">
                    (
                    {tab.id === 'in_stock'
                      ? stats.inStock
                      : tab.id === 'low_stock'
                        ? stats.lowStock
                        : tab.id === 'out_of_stock'
                          ? stats.outOfStock
                          : stats.inactive}
                    )
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Package className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-medium">No products match this filter</p>
            {stockFilter !== 'all' && (
              <button
                type="button"
                onClick={() => handleFilterChange('all')}
                className="text-sm text-primary font-semibold hover:underline"
              >
                View all products
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sold</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Adjust Stock</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => {
                  const status = getStockStatus(product);
                  return (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg bg-gray-100 overflow-hidden border border-gray-100 shrink-0">
                            {product.heroImageUrl ? (
                              <Image
                                src={product.heroImageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-[9px] text-gray-400">
                                IMG
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-heading truncate max-w-[200px]">{product.name}</div>
                            {product.brand && (
                              <div className="text-xs text-gray-400 font-semibold">{product.brand}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-400 font-mono truncate max-w-[140px]" title={product.slug}>
                          {product.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-heading font-semibold">₹{product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-emerald-700">{product.soldQuantity ?? 0}</div>
                        <div className="text-[10px] text-gray-400">units sold</div>
                      </td>
                      <td className="px-6 py-4">
                        <StockEditor
                          product={product}
                          onSaved={handleProductUpdated}
                          onError={(message) =>
                            setAlert({ title: 'Update failed', message, variant: 'warning' })
                          }
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/dashboard/products/${product._id}/edit`}
                          className="inline-flex items-center gap-1.5 p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-heading transition-all text-xs font-semibold"
                          title="Edit full product"
                        >
                          <Pencil className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 border border-gray-100 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 border border-gray-100 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <AlertModal
        isOpen={!!alert}
        title={alert?.title || ''}
        message={alert?.message || ''}
        variant={alert?.variant === 'success' ? 'success' : 'warning'}
        onClose={() => setAlert(null)}
      />
    </div>
  );
}
