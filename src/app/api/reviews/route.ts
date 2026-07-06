import { NextRequest, NextResponse } from 'next/server';
import Review from '@/models/Review';
import { withAuth } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { createProductReview, ReviewError, serializeReview } from '@/lib/reviewUtils';
import { IUser } from '@/models/User';

export const POST = withAuth(async (request: NextRequest, user: IUser) => {
  try {
    const body = await request.json();
    const review = await createProductReview(String(user._id), body);
    const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    return NextResponse.json(
      {
        status: true,
        message: 'Review submitted successfully',
        statusCode: 201,
        data: serializeReview(review as unknown as Record<string, unknown>, userName),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof ReviewError) {
      return NextResponse.json(
        { status: false, message: error.message, statusCode: error.statusCode, code: error.code },
        { status: error.statusCode }
      );
    }
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const GET = withAuth(async (request: NextRequest, user: IUser) => {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    const filter: Record<string, unknown> = { user: user._id };
    if (orderId) filter.order = orderId;

    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
    const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    return NextResponse.json({
      status: true,
      message: 'Reviews fetched',
      statusCode: 200,
      data: reviews.map((r) => serializeReview(r as unknown as Record<string, unknown>, userName)),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
