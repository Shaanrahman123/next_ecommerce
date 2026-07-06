import { NextRequest, NextResponse } from 'next/server';
import { withDb } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { getProductPublishedReviews } from '@/lib/reviewUtils';

export const GET = withDb(async (
  _request: NextRequest,
  context?: { params: Promise<{ productId: string }> }
) => {
  try {
    const { productId } = context?.params ? await context.params : { productId: '' };
    const reviews = await getProductPublishedReviews(productId);

    return NextResponse.json({
      status: true,
      message: 'Reviews fetched',
      statusCode: 200,
      data: reviews,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
