import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';
import { withAdmin } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { serializeAdminOrder } from '@/lib/orderSerializer';
import { restoreOrderStockFromDoc } from '@/lib/orderActions';
import type { OrderStatus } from '@/models/Order';

const VALID_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export const GET = withAdmin(async (
  _request: NextRequest,
  _user: unknown,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const order = await Order.findById(id).populate('user', 'firstName lastName email phone').lean();

    if (!order) {
      return NextResponse.json({ status: false, message: 'Order not found', statusCode: 404 }, { status: 404 });
    }

    return NextResponse.json({
      status: true,
      message: 'Order fetched',
      statusCode: 200,
      data: serializeAdminOrder(order as unknown as Record<string, unknown>),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const PATCH = withAdmin(async (
  request: NextRequest,
  _user: unknown,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, returnStatus, refundStatus } = body as {
      status?: OrderStatus;
      returnStatus?: string;
      refundStatus?: string;
    };

    const update: Record<string, unknown> = {};

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ status: false, message: 'Invalid status', statusCode: 400 }, { status: 400 });
      }
      update.status = status;
      if (status === 'delivered') update.deliveredAt = new Date();
    }

    const validReturnStatuses = ['none', 'requested', 'approved', 'completed', 'rejected'];
    if (returnStatus !== undefined && validReturnStatuses.includes(returnStatus)) {
      update.returnStatus = returnStatus;
    }

    const validRefundStatuses = ['none', 'pending', 'processed'];
    if (refundStatus !== undefined && validRefundStatuses.includes(refundStatus)) {
      update.refundStatus = refundStatus;
    }

    if (!Object.keys(update).length) {
      return NextResponse.json({ status: false, message: 'No valid fields to update', statusCode: 400 }, { status: 400 });
    }

    const existing = await Order.findById(id);
    if (!existing) {
      return NextResponse.json({ status: false, message: 'Order not found', statusCode: 404 }, { status: 404 });
    }

    if (update.status === 'cancelled' && existing.status !== 'cancelled') {
      const { restoreOrderStockFromDoc } = await import('@/lib/orderActions');
      await restoreOrderStockFromDoc(existing);
      update.cancelledAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(id, { $set: update }, { new: true })
      .populate('user', 'firstName lastName email phone')
      .lean();

    if (!order) {
      return NextResponse.json({ status: false, message: 'Order not found', statusCode: 404 }, { status: 404 });
    }

    return NextResponse.json({
      status: true,
      message: 'Order status updated',
      statusCode: 200,
      data: serializeAdminOrder(order as unknown as Record<string, unknown>),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
