import { NextRequest, NextResponse } from 'next/server';
import Review from '@/models/Review';
import { withAdmin } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { serializeReview, syncProductRating } from '@/lib/reviewUtils';

export const GET = withAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const reviews = await Review.find(filter).sort({ createdAt: -1 }).limit(100).populate('user', 'firstName lastName').lean();

    return NextResponse.json({
      status: true,
      message: 'Reviews fetched',
      statusCode: 200,
      data: reviews.map((r) => {
        const user = r.user as { firstName?: string; lastName?: string } | undefined;
        const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : undefined;
        return serializeReview(r as unknown as Record<string, unknown>, userName);
      }),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const PATCH = withAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { id, status } = body as { id?: string; status?: 'published' | 'hidden' };

    if (!id || !status) {
      return NextResponse.json({ status: false, message: 'Review id and status required', statusCode: 400 }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(id, { $set: { status } }, { new: true }).lean();
    if (!review) {
      return NextResponse.json({ status: false, message: 'Review not found', statusCode: 404 }, { status: 404 });
    }

    await syncProductRating(String(review.product));

    return NextResponse.json({
      status: true,
      message: 'Review updated',
      statusCode: 200,
      data: serializeReview(review as unknown as Record<string, unknown>),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
