import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';
import { withAuth } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { createOrder, OrderError } from '@/lib/createOrder';
import { serializeOrder, serializeOrderListItem } from '@/lib/orderSerializer';
import type { CreateOrderPayload } from '@/types/order';
import { IUser } from '@/models/User';

export const GET = withAuth(async (_request: NextRequest, user: IUser) => {
  try {
    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      status: true,
      message: 'Orders fetched',
      statusCode: 200,
      data: orders.map((o) => serializeOrderListItem(o as unknown as Record<string, unknown>)),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const POST = withAuth(async (request: NextRequest, user: IUser) => {
  try {
    const body = (await request.json()) as CreateOrderPayload;
    const order = await createOrder(String(user._id), body);

    return NextResponse.json(
      {
        status: true,
        message: 'Order placed successfully',
        statusCode: 201,
        data: serializeOrder(order as unknown as Record<string, unknown>),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof OrderError) {
      return NextResponse.json(
        { status: false, message: error.message, statusCode: error.statusCode, code: error.code },
        { status: error.statusCode }
      );
    }
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
