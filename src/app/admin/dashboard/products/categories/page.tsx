'use client';

import React from 'react';
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function CategoriesPage() {
    const categories = [
        { id: 1, name: 'Topwear', slug: 'topwear', count: 45, status: 'Active' },
        { id: 2, name: 'Bottomwear', slug: 'bottomwear', count: 32, status: 'Active' },
        { id: 3, name: 'Accessories', slug: 'accessories', count: 18, status: 'Active' },
        { id: 4, name: 'Outerwear', slug: 'outerwear', count: 12, status: 'Draft' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-black font-heading">Categories</h1>
                    <p className="text-gray-500">Manage your product categories and hierarchy</p>
                </div>
                <button className="flex items-center space-x-2 px-6 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all shadow-lg shadow-black/5">
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-black outline-none transition-all w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic">Category Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic">Slug</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic">Products</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-black">{category.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500">/{category.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-black font-medium">{category.count}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${category.status === 'Active'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {category.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-black transition-all">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-red-600 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
