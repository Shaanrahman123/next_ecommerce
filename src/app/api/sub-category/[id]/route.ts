import { NextRequest, NextResponse } from 'next/server';
import SubCategory from '@/models/SubCategory';
import Category from '@/models/Category';
import { withDb, withAdmin } from '@/lib/apiWrapper';
import { SUBCATEGORY_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { uploadImageIfNeeded } from '@/lib/cloudinary';
import { slugify } from '@/lib/slugify';
import { withImageUrl } from '@/lib/categorySerializer';

export const GET = withDb(async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const subCategory = await SubCategory.findById(id).populate('category');

    if (!subCategory) {
      return NextResponse.json(
        { status: false, message: SUBCATEGORY_MESSAGES.NOT_FOUND, statusCode: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      message: SUBCATEGORY_MESSAGES.FETCH_SUCCESS,
      statusCode: 200,
      data: withImageUrl(subCategory.toObject()),
    });
  } catch (error: unknown) {
    console.error('Error fetching Sub Category:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const PUT = withAdmin(async (
  request: NextRequest,
  _user: unknown,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, image, isActive, category, sortOrder } = body;
    let { slug } = body;

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return NextResponse.json(
        { status: false, message: SUBCATEGORY_MESSAGES.NOT_FOUND, statusCode: 404 },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    if (category !== undefined) {
      const parentCategory = await Category.findById(category);
      if (!parentCategory) {
        return NextResponse.json(
          { status: false, message: SUBCATEGORY_MESSAGES.CATEGORY_NOT_FOUND, statusCode: 400 },
          { status: 400 }
        );
      }
      updateData.category = category;
    }

    if (image !== undefined) {
      updateData.image = await uploadImageIfNeeded(image, 'sub_categories');
    }

    if (slug) {
      updateData.slug = slugify(slug);
    } else if (name) {
      updateData.slug = slugify(name);
    }

    const targetCategory = (updateData.category as string) || subCategory.category.toString();
    const targetSlug = (updateData.slug as string) || subCategory.slug;

    const duplicate = await SubCategory.findOne({
      _id: { $ne: id },
      category: targetCategory,
      slug: targetSlug,
    });

    if (duplicate) {
      return NextResponse.json(
        { status: false, message: SUBCATEGORY_MESSAGES.SLUG_EXISTS, statusCode: 400 },
        { status: 400 }
      );
    }

    const updated = await SubCategory.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('category');

    return NextResponse.json({
      status: true,
      message: SUBCATEGORY_MESSAGES.UPDATE_SUCCESS,
      statusCode: 200,
      data: withImageUrl(updated!.toObject()),
    });
  } catch (error: unknown) {
    console.error('Error updating Sub Category:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const DELETE = withAdmin(async (
  _request: NextRequest,
  _user: unknown,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const deleted = await SubCategory.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { status: false, message: SUBCATEGORY_MESSAGES.NOT_FOUND, statusCode: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      message: SUBCATEGORY_MESSAGES.DELETE_SUCCESS,
      statusCode: 200,
    });
  } catch (error: unknown) {
    console.error('Error deleting Sub Category:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
