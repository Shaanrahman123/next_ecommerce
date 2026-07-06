import { NextRequest, NextResponse } from 'next/server';
import { withDb } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { resolveCategoryContext } from '@/lib/categoryContext';
import { buildDynamicFilterSections } from '@/lib/productFilters';

export const GET = withDb(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const ctx = await resolveCategoryContext({
      department: searchParams.get('department'),
      category: searchParams.get('category'),
      item: searchParams.get('item'),
    });

    const sections = await buildDynamicFilterSections(ctx);

    return NextResponse.json({
      status: true,
      message: 'Filters fetched successfully',
      statusCode: 200,
      data: {
        context: ctx,
        sections,
      },
    });
  } catch (error: unknown) {
    console.error('Error fetching product filters:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
