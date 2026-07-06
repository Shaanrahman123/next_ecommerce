import { NextRequest, NextResponse } from 'next/server';
import HeroSlide from '@/models/HeroSlide';
import { withDb } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { serializeHeroSlideList } from '@/lib/cms/heroSerializer';

export const GET = withDb(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    const filter = activeOnly ? { isActive: true } : {};
    const slides = await HeroSlide.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean();

    return NextResponse.json({
      status: true,
      message: 'Hero slides fetched successfully',
      statusCode: 200,
      data: serializeHeroSlideList(slides as unknown as Record<string, unknown>[]),
    });
  } catch (error: unknown) {
    console.error('Error fetching hero slides:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
