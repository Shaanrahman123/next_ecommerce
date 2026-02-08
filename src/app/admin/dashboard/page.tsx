'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingBag,
    Users,
    Activity,
    MoreVertical,
    Clock,
    ArrowRight,
    ChevronDown
} from 'lucide-react';

const stats = [
    {
        label: 'Total Revenue',
        value: '$128,430',
        trend: '+12.5%',
        isUp: true,
        icon: DollarSign,
        chart: [30, 45, 35, 50, 40, 60, 55]
    },
    {
        label: 'Total Orders',
        value: '2,845',
        trend: '+18.2%',
        isUp: true,
        icon: ShoppingBag,
        chart: [20, 30, 40, 35, 50, 45, 65]
    },
    {
        label: 'Active Customers',
        value: '1,220',
        trend: '-3.1%',
        isUp: false,
        icon: Users,
        chart: [60, 55, 65, 50, 45, 40, 35]
    },
    {
        label: 'Conversion Rate',
        value: '4.8%',
        trend: '+2.4%',
        isUp: true,
        icon: Activity,
        chart: [25, 30, 35, 32, 40, 38, 45]
    },
];

const recentOrders = [
    { id: '#ORD-7234', customer: 'Alexander Wright', product: 'Premium Sneakers', amount: '$189.00', status: 'Delivered', date: '2 mins ago' },
    { id: '#ORD-7233', customer: 'Sophia Chen', product: 'Leather Handbag', amount: '$450.00', status: 'Processing', date: '15 mins ago' },
    { id: '#ORD-7232', customer: 'Marcus Miller', product: 'Classic White Tee', amount: '$45.00', status: 'Shipped', date: '1 hour ago' },
    { id: '#ORD-7231', customer: 'Elena Rodriguez', product: 'Canvas Tote Bag', amount: '$35.00', status: 'Delivered', date: '3 hours ago' },
    { id: '#ORD-7230', customer: 'James Wilson', product: 'Minimal Watch', amount: '$299.00', status: 'Processing', date: '5 hours ago' },
];

const revenueData = [
    { label: 'Mon', value: 18500 },
    { label: 'Tue', value: 24800 },
    { label: 'Wed', value: 12200 },
    { label: 'Thu', value: 31000 },
    { label: 'Fri', value: 26500 },
    { label: 'Sat', value: 35000 },
    { label: 'Sun', value: 22500 },
    { label: 'Mon', value: 28000 },
    { label: 'Tue', value: 32500 },
    { label: 'Wed', value: 38000 },
    { label: 'Thu', value: 34000 },
    { label: 'Fri', value: 41000 },
];

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = ['2023', '2024', '2025', '2026'];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('Last 7 Days');
    const [selectedMonth, setSelectedMonth] = useState('Month');
    const [selectedYear, setSelectedYear] = useState('Year');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const handleMonthSelect = (m: string) => {
        setSelectedMonth(m);
        setActiveTab(''); // Deselect Today/Last 7 Days
        setOpenDropdown(null);
    };

    const handleYearSelect = (y: string) => {
        setSelectedYear(y);
        setActiveTab(''); // Deselect Today/Last 7 Days
        setOpenDropdown(null);
    };

    return (
        <div className="space-y-8 animate-fade-in relative min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col space-y-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-black tracking-tight">Overview</h1>

                    {/* Tab Filter Center */}
                    <div className="flex-1 flex justify-center order-3 md:order-2 h-10">
                        <div className="inline-flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200 gap-1" ref={dropdownRef}>
                            {['Today', 'Last 7 Days'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setSelectedMonth('Month');
                                        setSelectedYear('Year');
                                    }}
                                    className={`px-6 py-2 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${activeTab === tab
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}

                            {/* Month Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('month')}
                                    className={`px-6 py-2 rounded-xl text-xs font-semibold capitalize flex items-center gap-1 transition-all ${selectedMonth !== 'Month' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {selectedMonth} <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'month' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openDropdown === 'month' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2 max-h-60 overflow-y-auto"
                                        >
                                            {months.map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => handleMonthSelect(m)}
                                                    className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-gray-50 rounded-lg transition-colors capitalize"
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Year Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('year')}
                                    className={`px-6 py-2 rounded-xl text-xs font-semibold capitalize flex items-center gap-1 transition-all ${selectedYear !== 'Year' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {selectedYear} <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'year' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openDropdown === 'year' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full right-0 mt-2 w-28 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2"
                                        >
                                            {years.map(y => (
                                                <button
                                                    key={y}
                                                    onClick={() => handleYearSelect(y)}
                                                    className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-gray-50 rounded-lg transition-colors capitalize"
                                                >
                                                    {y}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 order-2 md:order-3">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
                            Export Data
                        </button>
                        <button className="px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-black/90 transition-all">
                            View Analytics
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-gray-300 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-all duration-300">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className={`flex items-center space-x-1 text-xs font-bold ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                <span>{stat.trend}</span>
                                {stat.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 capitalize tracking-tight">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-black mt-1 tracking-tight">{stat.value}</h3>
                        </div>
                        {/* Sparkline Mock */}
                        <div className="mt-4 h-10 flex items-end space-x-1">
                            {stat.chart.map((point, i) => (
                                <div
                                    key={i}
                                    className={`w-full rounded-t-sm transition-all duration-500 ${stat.isUp ? 'bg-gray-200 group-hover:bg-black/20' : 'bg-gray-100'}`}
                                    style={{ height: `${point}%` }}
                                />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Revenue Growth Chart */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-3xl border border-gray-300"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-black capitalize tracking-tight">
                            Revenue Growth
                            {(selectedMonth !== 'Month' || selectedYear !== 'Year') && (
                                <span className="text-gray-400 font-medium ml-2 text-sm">
                                    - {selectedMonth !== 'Month' ? selectedMonth : ''} {selectedYear !== 'Year' ? selectedYear : ''}
                                </span>
                            )}
                        </h3>
                        <p className="text-[10px] font-semibold text-gray-400 capitalize tracking-widest">Global sales performance analytics</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-black rounded-full" />
                            <span className="text-xs font-bold capitalize text-black">Revenue</span>
                        </div>
                        <select className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs font-semibold outline-none">
                            <option>This Week</option>
                            <option>Last Week</option>
                        </select>
                    </div>
                </div>

                <div className="h-80 flex items-end justify-between w-full relative px-2">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-2 py-1">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full border-t border-gray-100 h-0" />)}
                    </div>

                    {/* Bar Chart Mock with guaranteed visibility */}
                    {revenueData.map((data, i) => (
                        <div key={i} className="relative group w-full max-w-[56px] flex flex-col items-center z-10">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(data.value / 45000) * 100}%` }}
                                transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                                className="w-full bg-gray-300 group-hover:bg-black rounded-t-lg transition-all duration-300 relative min-h-[4px]"
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    ${data.value.toLocaleString()}
                                </div>
                            </motion.div>
                            <span className="text-[10px] font-bold text-gray-400 mt-4 capitalize">{data.label}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-gray-300 overflow-hidden"
            >
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-black capitalize tracking-tight">Recent Orders</h3>
                        <p className="text-[10px] font-semibold text-gray-400 capitalize tracking-widest">Real-time transaction log</p>
                    </div>
                    <button className="text-xs font-bold text-black flex items-center space-x-1 hover:underline capitalize">
                        <span>View All Orders</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 capitalize tracking-widest">Order ID</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 capitalize tracking-widest">Customer</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 capitalize tracking-widest">Product</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 capitalize tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 capitalize tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 capitalize tracking-widest">Date</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6 font-bold text-xs text-black tracking-tight">{order.id}</td>
                                    <td className="px-8 py-6 text-xs text-black font-bold tracking-tight">{order.customer}</td>
                                    <td className="px-8 py-6 text-xs text-gray-500 font-semibold capitalize">{order.product}</td>
                                    <td className="px-8 py-6 text-xs font-bold text-black">{order.amount}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-sm text-[9px] font-bold capitalize tracking-tight
                      ${order.status === 'Delivered' ? 'bg-black text-white' :
                                                order.status === 'Processing' ? 'bg-gray-100 text-gray-500' :
                                                    'bg-gray-200 text-black'}
                    `}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-[10px] text-gray-400 flex items-center space-x-1 font-semibold capitalize">
                                        <Clock className="w-3 h-3" />
                                        <span>{order.date}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 hover:bg-black hover:text-white rounded-lg transition-all group">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
