import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/apiWrapper';
import Order from '@/models/Order';
import User from '@/models/User';
import { GLOBAL_MESSAGES } from '@/constants/messages';

function getDateRange(period: string, month?: string, year?: string): { start: Date; end: Date } {
  const now = new Date();

  if (period === 'today') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (period === 'last7days') {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (period === 'month' && month) {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const monthIndex = monthNames.indexOf(month);
    const y = year ? parseInt(year) : now.getFullYear();
    if (monthIndex !== -1) {
      const start = new Date(y, monthIndex, 1, 0, 0, 0, 0);
      const end = new Date(y, monthIndex + 1, 0, 23, 59, 59, 999);
      return { start, end };
    }
  }

  if (period === 'year' && year) {
    const y = parseInt(year);
    const start = new Date(y, 0, 1, 0, 0, 0, 0);
    const end = new Date(y, 11, 31, 23, 59, 59, 999);
    return { start, end };
  }

  // Default: last 7 days
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function getPreviousRange(current: { start: Date; end: Date }): { start: Date; end: Date } {
  const duration = current.end.getTime() - current.start.getTime();
  return {
    start: new Date(current.start.getTime() - duration - 1),
    end: new Date(current.start.getTime() - 1),
  };
}

function formatChartLabel(date: Date, period: string): string {
  if (period === 'today') {
    return date.getHours().toString().padStart(2, '0') + ':00';
  }
  if (period === 'last7days') {
    return date.toLocaleDateString('en-IN', { weekday: 'short' });
  }
  if (period === 'month') {
    return String(date.getDate());
  }
  // year
  return date.toLocaleDateString('en-IN', { month: 'short' });
}

export const GET = withAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'last7days';
    const month = searchParams.get('month') || undefined;
    const year = searchParams.get('year') || undefined;

    const range = getDateRange(period, month, year);
    const prevRange = getPreviousRange(range);

    // ── Current period aggregations ──────────────────────────────────────────
    // Revenue only counts delivered orders; orders/customers count all statuses
    const [currentRevAgg] = await Order.aggregate([
      { $match: { createdAt: { $gte: range.start, $lte: range.end }, status: 'delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);
    const [currentAgg] = await Order.aggregate([
      { $match: { createdAt: { $gte: range.start, $lte: range.end } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          uniqueUsers: { $addToSet: '$user' },
        },
      },
    ]);

    const [prevRevAgg] = await Order.aggregate([
      { $match: { createdAt: { $gte: prevRange.start, $lte: prevRange.end }, status: 'delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);
    const [prevAgg] = await Order.aggregate([
      { $match: { createdAt: { $gte: prevRange.start, $lte: prevRange.end } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          uniqueUsers: { $addToSet: '$user' },
        },
      },
    ]);

    const revenue = currentRevAgg?.totalRevenue ?? 0;
    const orders = currentAgg?.totalOrders ?? 0;
    const customers = currentAgg?.uniqueUsers?.length ?? 0;

    const prevRevenue = prevRevAgg?.totalRevenue ?? 0;
    const prevOrders = prevAgg?.totalOrders ?? 0;
    const prevCustomers = prevAgg?.uniqueUsers?.length ?? 0;

    function calcTrend(current: number, previous: number) {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100 * 10) / 10;
    }

    const revenueTrend = calcTrend(revenue, prevRevenue);
    const ordersTrend = calcTrend(orders, prevOrders);
    const customersTrend = calcTrend(customers, prevCustomers);

    // ── Revenue growth chart ─────────────────────────────────────────────────
    let chartGroupBy: Record<string, unknown>;
    let chartBuckets: { label: string; start: Date; end: Date }[] = [];

    if (period === 'today') {
      // Hourly buckets for today
      const d = range.start;
      for (let h = 0; h < 24; h += 2) {
        const s = new Date(d);
        s.setHours(h, 0, 0, 0);
        const e = new Date(d);
        e.setHours(h + 1, 59, 59, 999);
        chartBuckets.push({ label: `${h.toString().padStart(2,'0')}:00`, start: s, end: e });
      }
    } else if (period === 'last7days') {
      // Daily for last 7 days
      for (let i = 6; i >= 0; i--) {
        const s = new Date(range.end);
        s.setDate(range.end.getDate() - i);
        s.setHours(0, 0, 0, 0);
        const e = new Date(s);
        e.setHours(23, 59, 59, 999);
        chartBuckets.push({ label: s.toLocaleDateString('en-IN', { weekday: 'short' }), start: s, end: e });
      }
    } else if (period === 'month') {
      // Weekly buckets for the month
      const s = new Date(range.start);
      while (s <= range.end) {
        const bucketStart = new Date(s);
        const bucketEnd = new Date(s);
        bucketEnd.setDate(s.getDate() + 6);
        if (bucketEnd > range.end) bucketEnd.setTime(range.end.getTime());
        bucketEnd.setHours(23, 59, 59, 999);
        chartBuckets.push({ label: `W${Math.ceil(bucketStart.getDate()/7)}`, start: bucketStart, end: bucketEnd });
        s.setDate(s.getDate() + 7);
      }
    } else {
      // Monthly buckets for the year
      const y = year ? parseInt(year) : new Date().getFullYear();
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      for (let m = 0; m < 12; m++) {
        const s = new Date(y, m, 1, 0, 0, 0, 0);
        const e = new Date(y, m + 1, 0, 23, 59, 59, 999);
        chartBuckets.push({ label: monthNames[m], start: s, end: e });
      }
    }

    // Run chart revenue query in parallel — only delivered orders
    const chartData = await Promise.all(
      chartBuckets.map(async (bucket) => {
        const [agg] = await Order.aggregate([
          { $match: { createdAt: { $gte: bucket.start, $lte: bucket.end }, status: 'delivered' } },
          { $group: { _id: null, value: { $sum: '$total' } } },
        ]);
        return { label: bucket.label, value: agg?.value ?? 0 };
      })
    );

    // ── Total customers ever ─────────────────────────────────────────────────
    const totalCustomersEver = await User.countDocuments({ role: 'user' });

    // ── Recent orders ────────────────────────────────────────────────────────
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'firstName lastName email')
      .lean();

    const serializedRecent = recentOrders.map((o) => {
      const user = o.user as unknown as { firstName?: string; lastName?: string; email?: string } | null;
      const firstItem = o.items?.[0];
      return {
        id: String(o._id),
        orderNumber: o.orderNumber,
        customer: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Unknown',
        email: user?.email || '',
        product: firstItem?.name || 'Unknown Product',
        amount: o.total,
        status: o.status,
        date: o.createdAt.toISOString(),
      };
    });

    // ── Revenue sparkline (mini 7-point per stat) ────────────────────────────
    // Build 7-point sparklines for each stat based on current period
    async function buildSparkline(field: 'revenue' | 'orders' | 'customers') {
      const points: number[] = [];
      const step = Math.max(1, Math.floor((range.end.getTime() - range.start.getTime()) / 6 / 86400000));
      for (let i = 0; i < 7; i++) {
        const s = new Date(range.start.getTime() + i * step * 86400000);
        const e = new Date(s.getTime() + step * 86400000 - 1);
        const clampedEnd = e > range.end ? range.end : e;

        if (field === 'customers') {
          const [agg] = await Order.aggregate([
            { $match: { createdAt: { $gte: s, $lte: clampedEnd } } },
            { $group: { _id: null, count: { $addToSet: '$user' } } },
            { $project: { count: { $size: '$count' } } },
          ]);
          points.push(agg?.count ?? 0);
        } else if (field === 'revenue') {
          // Revenue sparkline: delivered orders only
          const [agg] = await Order.aggregate([
            { $match: { createdAt: { $gte: s, $lte: clampedEnd }, status: 'delivered' } },
            { $group: { _id: null, value: { $sum: '$total' } } },
          ]);
          points.push(agg?.value ?? 0);
        } else {
          // Orders sparkline: all statuses
          const [agg] = await Order.aggregate([
            { $match: { createdAt: { $gte: s, $lte: clampedEnd } } },
            { $group: { _id: null, value: { $sum: 1 } } },
          ]);
          points.push(agg?.value ?? 0);
        }
      }
      return points;
    }

    const [revenueSparkline, ordersSparkline, customersSparkline] = await Promise.all([
      buildSparkline('revenue'),
      buildSparkline('orders'),
      buildSparkline('customers'),
    ]);

    return NextResponse.json({
      status: true,
      statusCode: 200,
      message: 'Dashboard data fetched',
      data: {
        stats: {
          revenue: { value: revenue, trend: revenueTrend, sparkline: revenueSparkline },
          orders: { value: orders, trend: ordersTrend, sparkline: ordersSparkline },
          customers: { value: customers, trend: customersTrend, sparkline: customersSparkline },
          totalCustomers: totalCustomersEver,
        },
        chartData,
        recentOrders: serializedRecent,
        period,
        range: { start: range.start.toISOString(), end: range.end.toISOString() },
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    console.error('[Admin Dashboard API]', error);
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
