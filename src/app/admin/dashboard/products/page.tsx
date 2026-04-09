'use client';

import React from 'react';
import { Plus, Search, Filter, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function ProductListPage() {
    const products = [
        {
            id: 1,
            name: 'Premium Oversized Hoodie',
            category: 'Topwear',
            price: '$89.00',
            stock: 45,
            status: 'Active',
            image: '/placeholder.webp'
        },
        {
            id: 2,
            name: 'Slim Fit Chinos',
            category: 'Bottomwear',
            price: '$75.00',
            stock: 0,
            status: 'Out of Stock',
            image: '/placeholder.webp'
        },
        {
            id: 3,
            name: 'Minimalist Cotton Tee',
            category: 'Topwear',
            price: '$35.00',
            stock: 12,
            status: 'Low Stock',
            image: '/placeholder.webp'
        },
        {
            id: 4,
            name: 'Canvas Tote Bag',
            category: 'Accessories',
            price: '$25.00',
            stock: 120,
            status: 'Active',
            image: '/placeholder.webp'
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-black font-heading">Product List</h1>
                    <p className="text-gray-500">Manage your product catalog and inventory</p>
                </div>
                <button className="flex items-center space-x-2 px-6 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all shadow-lg shadow-black/5">
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-black outline-none transition-all w-full md:w-64"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </button>
                        <select className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-medium outline-none cursor-pointer">
                            <option>Latest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Stock: Low to High</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic">Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                                                <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400">IMG</div>
                                            </div>
                                            <div className="font-medium text-black">{product.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500">{product.category}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-black font-semibold">{product.price}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">{product.stock} units</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.status === 'Active'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : product.status === 'Low Stock'
                                                    ? 'bg-orange-50 text-orange-600'
                                                    : 'bg-red-50 text-red-600'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-black transition-all" title="View">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-black transition-all" title="Edit">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-red-500 transition-all" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Showing 1 to 4 of 24 products</p>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 border border-gray-100 rounded-xl text-sm font-medium disabled:opacity-50" disabled>Previous</button>
                        <button className="px-4 py-2 border border-gray-100 rounded-xl text-sm font-medium hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
