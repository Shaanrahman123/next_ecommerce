import { NextRequest, NextResponse } from 'next/server';
import CategoryFilterField from '@/models/CategoryFilterField';
import SubCategory from '@/models/SubCategory';
import { withAdmin } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';

export const GET = withAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const subCategoryId = searchParams.get('subCategory');

    const filter: Record<string, unknown> = {};
    if (subCategoryId) filter.subCategory = subCategoryId;

    const fields = await CategoryFilterField.find(filter).sort({ sortOrder: 1, label: 1 });

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

export const POST = withAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { subCategory, key, label, sortOrder = 0, isActive = true } = body;

    if (!subCategory || !key?.trim() || !label?.trim()) {
      return NextResponse.json(
        { status: false, message: 'Sub category, key, and label are required', statusCode: 400 },
        { status: 400 }
      );
    }

    const sub = await SubCategory.findById(subCategory);
    if (!sub) {
      return NextResponse.json(
        { status: false, message: 'Sub category not found', statusCode: 400 },
        { status: 400 }
      );
    }

    const existing = await CategoryFilterField.findOne({
      subCategory,
      key: key.trim(),
    });
    if (existing) {
      return NextResponse.json(
        { status: false, message: 'Filter field already exists for this sub category', statusCode: 400 },
        { status: 400 }
      );
    }

    const field = await CategoryFilterField.create({
      subCategory,
      key: key.trim(),
      label: label.trim(),
      sortOrder: Number(sortOrder) || 0,
      isActive,
    });

    return NextResponse.json(
      { status: true, message: 'Filter field created', statusCode: 201, data: field },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
