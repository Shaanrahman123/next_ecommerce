import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';
import { withAuth } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { serializeOrder } from '@/lib/orderSerializer';
import { IUser } from '@/models/User';

export const GET = withAuth(async (
  _request: NextRequest,
  user: IUser,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const order = await Order.findOne({ _id: id, user: user._id }).lean();
    if (!order) {
      return NextResponse.json(
        { status: false, message: 'Order not found', statusCode: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      message: 'Order fetched',
      statusCode: 200,
      data: serializeOrder(order as unknown as Record<string, unknown>),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
