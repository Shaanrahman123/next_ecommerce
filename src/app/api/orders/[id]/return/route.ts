import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { requestUserReturn, OrderActionError } from '@/lib/orderActions';
import { serializeOrder } from '@/lib/orderSerializer';
import { IUser } from '@/models/User';

export const POST = withAuth(async (
  request: NextRequest,
  user: IUser,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const reason = typeof body.reason === 'string' ? body.reason : undefined;

    const order = await requestUserReturn(String(user._id), id, reason);

    return NextResponse.json({
      status: true,
      message: 'Return request submitted successfully',
      statusCode: 200,
      data: serializeOrder(order as unknown as Record<string, unknown>),
    });
  } catch (error: unknown) {
    if (error instanceof OrderActionError) {
      return NextResponse.json(
        { status: false, message: error.message, statusCode: error.statusCode, code: error.code },
        { status: error.statusCode }
      );
    }
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
