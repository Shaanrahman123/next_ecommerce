'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    ShoppingBag,
    Users,
    IndianRupee,
    MoreVertical,
    ArrowRight,
    ChevronDown,
    Calendar,
    RefreshCw,
    Package,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area,
} from 'recharts';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatData {
    value: number;
    trend: number;
    sparkline: number[];
}

interface DashboardStats {
    revenue: StatData;
    orders: StatData;
    customers: StatData;
    totalCustomers: number;
}

interface ChartPoint {
    label: string;
    value: number;
}

interface RecentOrder {
    id: string;
    orderNumber: string;
    customer: string;
    email: string;
    product: string;
    amount: number;
    status: string;
    date: string;
}

interface DashboardData {
    stats: DashboardStats;
    chartData: ChartPoint[];
    recentOrders: RecentOrder[];
    period: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatINR(value: number): string {
    if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(1)}L`;
    if (value >= 1_000) return `₹${(value / 1_000).toFixed(1)}k`;
    return `₹${value.toLocaleString('en-IN')}`;
}

function formatINRFull(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

const STATUS_STYLES: Record<string, string> = {
    delivered: 'bg-emerald-100 text-emerald-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-sky-100 text-sky-800',
    cancelled: 'bg-red-100 text-red-700',
};

const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({
    label, icon: Icon, stat, index, isLoading,
}: {
    label: string;
    icon: React.ElementType;
    stat?: StatData;
    index: number;
    isLoading: boolean;
}) {
    const isUp = (stat?.trend ?? 0) >= 0;
    const trendText = stat?.trend != null
        ? `${stat.trend >= 0 ? '+' : ''}${stat.trend}%`
        : null;

    // Format value
    let displayValue = '—';
    if (stat && !isLoading) {
        if (label === 'Total Revenue') displayValue = formatINR(stat.value);
        else displayValue = stat.value.toLocaleString('en-IN');
    }

    return (
        <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="bg-white p-6 rounded-3xl border border-gray-300 transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon className="w-5 h-5" />
                </div>
                {isLoading ? (
                    <Skeleton className="w-16 h-5" />
                ) : trendText ? (
                    <div className={`flex items-center space-x-1 text-xs font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                        <span>{trendText}</span>
                        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    </div>
                ) : null}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                {isLoading ? (
                    <Skeleton className="h-8 w-32 mt-2" />
                ) : (
                    <h3 className="text-2xl font-bold text-heading mt-1 tracking-tight">{displayValue}</h3>
                )}
            </div>
            <div className="mt-4 h-12 w-full">
                {isLoading ? (
                    <Skeleton className="h-full w-full" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={(stat?.sparkline ?? []).map(v => ({ value: v }))}>
                            <defs>
                                <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={isUp ? '#22c55e' : '#ef4444'}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill={`url(#grad-${index})`}
                                isAnimationActive
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('Last 7 Days');
    const [selectedMonth, setSelectedMonth] = useState('Month');
    const [selectedYear, setSelectedYear] = useState('Year');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Build query params from current filter state
    const buildParams = useCallback(() => {
        const params = new URLSearchParams();

        if (activeTab === 'Today') {
            params.set('period', 'today');
        } else if (activeTab === 'Last 7 Days') {
            params.set('period', 'last7days');
        } else if (selectedMonth !== 'Month') {
            params.set('period', 'month');
            params.set('month', selectedMonth);
            if (selectedYear !== 'Year') params.set('year', selectedYear);
        } else if (selectedYear !== 'Year') {
            params.set('period', 'year');
            params.set('year', selectedYear);
        } else {
            params.set('period', 'last7days');
        }

        return params.toString();
    }, [activeTab, selectedMonth, selectedYear]);

    const fetchDashboard = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const qs = buildParams();
            const res = await fetch(`/api/admin/dashboard?${qs}`, {
                credentials: 'include',
            });
            const json = await res.json();
            if (!json.status) throw new Error(json.message);
            setData(json.data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    }, [buildParams]);

    // Fetch on filter change
    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const handleMonthSelect = (m: string) => {
        setSelectedMonth(m);
        setActiveTab('');
        setOpenDropdown(null);
    };

    const handleYearSelect = (y: string) => {
        setSelectedYear(y);
        setActiveTab('');
        setOpenDropdown(null);
    };

    const chartData = data?.chartData ?? [];
    const recentOrders = data?.recentOrders ?? [];

    // Period label for chart title
    const periodLabel = (() => {
        if (activeTab === 'Today') return '— Today';
        if (activeTab === 'Last 7 Days') return '— Last 7 Days';
        if (selectedMonth !== 'Month' && selectedYear !== 'Year') return `— ${selectedMonth} ${selectedYear}`;
        if (selectedMonth !== 'Month') return `— ${selectedMonth}`;
        if (selectedYear !== 'Year') return `— ${selectedYear}`;
        return '';
    })();

    return (
        <div className="space-y-8 animate-fade-in relative min-h-screen">
            {/* ── Header ── */}
            <div className="flex flex-col space-y-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-heading tracking-tight">Overview</h1>

                    {/* ── Period Filter ── */}
                    <div className="flex-1 flex justify-center order-3 md:order-2 h-10">
                        <div
                            className="inline-flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200 gap-1"
                            ref={dropdownRef}
                        >
                            {['Today', 'Last 7 Days'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setSelectedMonth('Month');
                                        setSelectedYear('Year');
                                    }}
                                    className={`px-6 py-2 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${activeTab === tab
                                        ? 'bg-white text-heading shadow-sm'
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
                                    className={`px-6 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${selectedMonth !== 'Month'
                                        ? 'bg-white text-heading shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {selectedMonth}
                                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'month' ? 'rotate-180' : ''}`} />
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
                                                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-gray-50 rounded-lg transition-colors ${selectedMonth === m ? 'text-heading' : 'text-gray-600'}`}
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
                                    className={`px-6 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${selectedYear !== 'Year'
                                        ? 'bg-white text-heading shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {selectedYear}
                                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'year' ? 'rotate-180' : ''}`} />
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
                                                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-gray-50 rounded-lg transition-colors ${selectedYear === y ? 'text-heading' : 'text-gray-600'}`}
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
                        <button
                            onClick={fetchDashboard}
                            disabled={isLoading}
                            className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <Link href="/admin/dashboard/orders">
                            <button className="px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:bg-black/90 transition-all">
                                View Orders
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center gap-3">
                    <span className="font-semibold">Error:</span> {error}
                    <button onClick={fetchDashboard} className="ml-auto text-xs underline">Retry</button>
                </div>
            )}

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Revenue" icon={IndianRupee} stat={data?.stats.revenue} index={0} isLoading={isLoading} />
                <StatCard label="Total Orders" icon={ShoppingBag} stat={data?.stats.orders} index={1} isLoading={isLoading} />
                <StatCard label="Active Customers" icon={Users} stat={data?.stats.customers} index={2} isLoading={isLoading} />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24 }}
                    className="bg-white p-6 rounded-3xl border border-gray-300 group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <Package className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Customers</p>
                        {isLoading ? (
                            <Skeleton className="h-8 w-24 mt-2" />
                        ) : (
                            <h3 className="text-2xl font-bold text-heading mt-1 tracking-tight">
                                {(data?.stats.totalCustomers ?? 0).toLocaleString('en-IN')}
                            </h3>
                        )}
                    </div>
                    <p className="mt-4 text-xs text-gray-400 font-medium">All registered users</p>
                </motion.div>
            </div>

            {/* ── Revenue Growth Chart ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-3xl border border-gray-300"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-heading tracking-tight">
                            Revenue Growth
                            {periodLabel && (
                                <span className="text-gray-400 font-medium ml-2 text-sm">{periodLabel}</span>
                            )}
                        </h3>
                        <p className="text-sm font-medium text-gray-500">Sales performance analytics</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded-full" />
                        <span className="text-sm font-semibold text-heading">Revenue</span>
                    </div>
                </div>

                <div className="h-80 w-full mt-4">
                    {isLoading ? (
                        <div className="h-full w-full flex items-end gap-2 px-4">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-gray-200 rounded-t-lg animate-pulse"
                                    style={{ height: `${30 + Math.random() * 50}%` }}
                                />
                            ))}
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                                barSize={40}
                            >
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                                    tickFormatter={(v) => formatINR(v)}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-primary text-on-primary p-3 rounded-xl shadow-2xl border border-gray-800">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                                                        {payload[0].payload.label}
                                                    </p>
                                                    <p className="text-sm font-bold">
                                                        {formatINRFull(Number(payload[0].value ?? 0))}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1500}>
                                    {chartData.map((_, i) => (
                                        <Cell
                                            key={`cell-${i}`}
                                            fill={i === chartData.length - 1 ? '#000000' : '#e5e7eb'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </motion.div>

            {/* ── Recent Orders ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-gray-300 overflow-hidden"
            >
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-heading tracking-tight">Recent Orders</h3>
                        <p className="text-sm font-medium text-gray-500">Latest 10 transactions</p>
                    </div>
                    <Link href="/admin/dashboard/orders" className="text-xs font-bold text-heading flex items-center space-x-1 hover:underline">
                        <span>View All Orders</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-8 space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <Skeleton className="h-5 w-28" />
                                    <Skeleton className="h-5 w-32 flex-1" />
                                    <Skeleton className="h-5 w-40 flex-1" />
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            ))}
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className="py-16 text-center text-gray-400">
                            <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-semibold">No orders yet</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                                    <th className="px-8 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                                    <th className="px-8 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                                    <th className="px-8 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                                    <th className="px-8 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                    <th className="px-8 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                                    <th className="px-8 py-5" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5 font-bold text-sm text-heading tracking-tight">
                                            {order.orderNumber}
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-heading">{order.customer || '—'}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{order.email}</p>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-gray-500 font-semibold max-w-[180px] truncate">
                                            {order.product}
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-heading">
                                            {formatINRFull(order.amount)}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-xs text-gray-400 font-semibold">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(order.date)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <Link href={`/admin/dashboard/orders?id=${order.id}`}>
                                                <button className="p-2 hover:bg-primary hover:text-on-primary rounded-lg transition-all">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
