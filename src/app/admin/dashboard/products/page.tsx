'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { productService } from '@/services/product.service';
import { Product } from '@/types/product';

function getStockStatus(product: Product): { label: string; className: string } {
  if (!product.isActive) {
    return { label: 'Inactive', className: 'bg-gray-100 text-gray-500' };
  }
  if (!product.inStock || product.stockQuantity === 0) {
    return { label: 'Out of Stock', className: 'bg-red-50 text-red-600' };
  }
  if (product.stockQuantity <= 10) {
    return { label: 'Low Stock', className: 'bg-orange-50 text-orange-600' };
  }
  return { label: 'Active', className: 'bg-emerald-50 text-emerald-600' };
}

function getCategoryPath(product: Product): string {
  const parts: string[] = [];
  const sub = product.subCategories?.[0];
  const cat = product.categories?.[0];
  const dept = product.superCategories?.[0];

  if (typeof dept === 'object' && dept?.name) parts.push(dept.name);
  if (typeof cat === 'object' && cat?.name) parts.push(cat.name);
  if (typeof sub === 'object' && sub?.name) parts.push(sub.name);

  return parts.length ? parts.join(' › ') : '—';
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await productService.list({ page, limit: 10, search: search || undefined });
      setProducts(res.data || []);
      const meta = (res as { meta?: { totalPages: number; totalDocs: number } }).meta;
      setTotalPages(meta?.totalPages || 1);
      setTotalDocs(meta?.totalDocs || 0);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchProducts, search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await productService.delete(deleteTarget._id);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Delete failed';
      alert(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading font-heading">Product List</h1>
          <p className="text-gray-500">Manage your product catalog and inventory</p>
        </div>
        <Link
          href="/admin/dashboard/products/add"
          className="flex items-center space-x-2 px-6 py-2 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary-hover transition-all shadow-lg shadow-black/5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none transition-all w-full md:w-64"
            />
          </div>
          <p className="text-sm text-gray-500 font-medium">{totalDocs} products total</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-gray-500 font-medium">No products found</p>
            <Link
              href="/admin/dashboard/products/add"
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-xl text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</th>
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
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100 shrink-0">
                            {product.heroImageUrl ? (
                              <Image
                                src={product.heroImageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400">
                                IMG
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-heading">{product.name}</div>
                            {product.brand && (
                              <div className="text-xs text-gray-400 font-semibold">{product.brand}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{getCategoryPath(product)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-heading font-semibold">₹{product.price.toFixed(2)}</div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-xs text-gray-400 line-through">₹{product.originalPrice.toFixed(2)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 font-semibold">{product.stockQuantity} units</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/admin/dashboard/products/${product._id}/edit`}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-heading transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-red-500 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
            <div className="flex space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 border border-gray-100 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
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

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />
    </div>
  );
}
