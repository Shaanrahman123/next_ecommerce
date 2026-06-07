import { NextRequest, NextResponse } from 'next/server';
import ProductSpecOption from '@/models/ProductSpecOption';
import SubCategory from '@/models/SubCategory';
import { withDb, withAdmin } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';

export const GET = withDb(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const subCategoryId = searchParams.get('subCategory');

    const filter: Record<string, unknown> = {};

    if (key) filter.key = key;

    if (subCategoryId) {
      filter.$or = [{ subCategory: null }, { subCategory: subCategoryId }];
    }

    const options = await ProductSpecOption.find(filter).sort({ value: 1 });

    const grouped: Record<string, string[]> = {};
    for (const opt of options) {
      if (!grouped[opt.key]) grouped[opt.key] = [];
      if (!grouped[opt.key].includes(opt.value)) {
        grouped[opt.key].push(opt.value);
      }
    }

    return NextResponse.json({
      status: true,
      message: 'Spec options fetched successfully',
      statusCode: 200,
      data: grouped,
    });
  } catch (error: unknown) {
    console.error('Error fetching spec options:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const POST = withAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { key, value, subCategory } = body;

    if (!key?.trim() || !value?.trim()) {
      return NextResponse.json(
        { status: false, message: 'Key and value are required', statusCode: 400 },
        { status: 400 }
      );
    }

    if (subCategory) {
      const exists = await SubCategory.findById(subCategory);
      if (!exists) {
        return NextResponse.json(
          { status: false, message: 'Sub category not found', statusCode: 400 },
          { status: 400 }
        );
      }
    }

    const normalizedKey = key.trim();
    const normalizedValue = value.trim();

    let option = await ProductSpecOption.findOne({
      key: normalizedKey,
      value: normalizedValue,
      subCategory: subCategory || null,
    });

    if (!option) {
      option = await ProductSpecOption.create({
        key: normalizedKey,
        value: normalizedValue,
        subCategory: subCategory || null,
      });
    }

    return NextResponse.json(
      {
        status: true,
        message: 'Spec option saved',
        statusCode: 201,
        data: option,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error saving spec option:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
