'use client';

import React from 'react';
import { Search, AlertCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function InventoryPage() {
    const stockItems = [
        { id: 1, name: 'Premium Oversized Hoodie', sku: 'HD-001', stock: 45, price: '$89.00', status: 'In Stock' },
        { id: 2, name: 'Minimalist Cotton Tee', sku: 'TS-002', stock: 12, price: '$35.00', status: 'Low Stock' },
        { id: 3, name: 'Slim Fit Chinos', sku: 'PN-005', stock: 0, price: '$75.00', status: 'Out of Stock' },
        { id: 4, name: 'Canvas Tote Bag', sku: 'AC-009', stock: 120, price: '$25.00', status: 'In Stock' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-black font-heading">Inventory</h1>
                    <p className="text-gray-500">Track and manage your stock levels</p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-medium hover:bg-white transition-all">
                        <ArrowDownLeft className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                    <button className="flex items-center space-x-2 px-6 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all shadow-lg shadow-black/5">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>Import Stock</span>
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Items', value: '2,450', color: 'bg-black' },
                    { label: 'Out of Stock', value: '12', color: 'bg-red-500' },
                    { label: 'Low Stock Alert', value: '08', color: 'bg-orange-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                        <div className="mt-2 flex items-end justify-between">
                            <h3 className="text-3xl font-bold text-black">{stat.value}</h3>
                            <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by SKU or name..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-black outline-none transition-all w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic">SKU</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic">Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider italic">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stockItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-black">{item.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-400 font-mono">{item.sku}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-black font-semibold">{item.stock} units</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">{item.price}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'In Stock'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : item.status === 'Low Stock'
                                                    ? 'bg-orange-50 text-orange-600'
                                                    : 'bg-red-50 text-red-600'
                                            }`}>
                                            {item.status}
                                        </span>
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
