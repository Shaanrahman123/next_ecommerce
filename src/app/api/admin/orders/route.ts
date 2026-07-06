import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';
import { withAdmin } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { serializeAdminOrder } from '@/lib/orderSerializer';
import type { OrderStatus } from '@/models/Order';

const VALID_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export const GET = withAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const search = (searchParams.get('search') || '').trim();

    const filter: Record<string, unknown> = {};
    if (status && VALID_STATUSES.includes(status as OrderStatus)) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [orders, totalDocs] = await Promise.all([
      Order.find(filter)
        .populate('user', 'firstName lastName email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocs / limit) || 1;

    return NextResponse.json({
      status: true,
      message: 'Orders fetched',
      statusCode: 200,
      data: orders.map((o) => serializeAdminOrder(o as unknown as Record<string, unknown>)),
      meta: { totalDocs, page, limit, totalPages },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
