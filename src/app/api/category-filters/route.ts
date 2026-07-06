import { NextRequest, NextResponse } from 'next/server';
import CategoryFilterField from '@/models/CategoryFilterField';
import { withDb } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';

export const GET = withDb(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const subCategoryId = searchParams.get('subCategory');

    if (!subCategoryId) {
      return NextResponse.json(
        { status: false, message: 'subCategory is required', statusCode: 400 },
        { status: 400 }
      );
    }

    const fields = await CategoryFilterField.find({ subCategory: subCategoryId, isActive: true }).sort({
      sortOrder: 1,
      label: 1,
    });

    return NextResponse.json({
      status: true,
      message: 'Filter fields fetched',
      statusCode: 200,
      data: fields,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
