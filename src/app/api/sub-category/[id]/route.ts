import { NextRequest, NextResponse } from 'next/server';
import SubCategory from '@/models/SubCategory';
import SuperCategory from '@/models/SuperCategory';
import { withDb, withAdmin } from '@/lib/apiWrapper';
import { SUBCATEGORY_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { uploadImageIfNeeded } from '@/lib/cloudinary';

// helper to slugify a string
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export const GET = withDb(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const subCategory = await SubCategory.findById(id).populate('superCategories');

    if (!subCategory) {
      return NextResponse.json({
        status: false,
        message: SUBCATEGORY_MESSAGES.NOT_FOUND,
        statusCode: 404
      }, { status: 404 });
    }

    return NextResponse.json({
      status: true,
      message: SUBCATEGORY_MESSAGES.FETCH_SUCCESS,
      statusCode: 200,
      data: subCategory
    }, { status: 200 });

  } catch (error: any) {
    console.error(`Error fetching Sub Category:`, error);
    return NextResponse.json({
      status: false,
      message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: 500
    }, { status: 500 });
  }
});

export const PUT = withAdmin(async (
  request: NextRequest,
  user: any,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const body = await request.json();
    const { name, description, image, isActive, superCategories } = body;
    let { slug } = body;

    // Check if sub category exists
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return NextResponse.json({
        status: false,
        message: SUBCATEGORY_MESSAGES.NOT_FOUND,
        statusCode: 404
      }, { status: 404 });
    }

    // Validate parent superCategories if it's changing
    if (superCategories !== undefined) {
      if (!Array.isArray(superCategories) || superCategories.length === 0) {
        return NextResponse.json({
          status: false,
          message: SUBCATEGORY_MESSAGES.SUPER_CATEGORY_REQUIRED,
          statusCode: 400
        }, { status: 400 });
      }
      let existingCount = 0;
      try {
        existingCount = await SuperCategory.countDocuments({
          _id: { $in: superCategories }
        });
      } catch (err) {}
      if (existingCount !== superCategories.length) {
        return NextResponse.json({
          status: false,
          message: SUBCATEGORY_MESSAGES.SUPER_CATEGORY_NOT_FOUND,
          statusCode: 400
        }, { status: 400 });
      }
    }

    // Prepare update object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (superCategories !== undefined) updateData.superCategories = superCategories;
    
    if (image !== undefined) {
      updateData.image = await uploadImageIfNeeded(image, 'sub_categories');
    }

    if (slug) {
      updateData.slug = slugify(slug);
    } else if (name && !slug) {
      updateData.slug = slugify(name);
    }

    // Check for duplicates if name or slug is changing
    if (updateData.name || updateData.slug) {
      const orConditions = [];
      if (updateData.name) orConditions.push({ name: updateData.name });
      if (updateData.slug) orConditions.push({ slug: updateData.slug });

      const duplicate = await SubCategory.findOne({
        _id: { $ne: id },
        $or: orConditions
      });

      if (duplicate) {
        return NextResponse.json({
          status: false,
          message: duplicate.name === updateData.name
            ? SUBCATEGORY_MESSAGES.DUPLICATE_NAME
            : SUBCATEGORY_MESSAGES.DUPLICATE_SLUG,
          statusCode: 400
        }, { status: 400 });
      }
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('superCategories');

    return NextResponse.json({
      status: true,
      message: SUBCATEGORY_MESSAGES.UPDATE_SUCCESS,
      statusCode: 200,
      data: updatedSubCategory
    }, { status: 200 });

  } catch (error: any) {
    console.error(`Error updating Sub Category:`, error);
    return NextResponse.json({
      status: false,
      message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: 500
    }, { status: 500 });
  }
});

export const DELETE = withAdmin(async (
  _request: NextRequest,
  user: any,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

    if (!deletedSubCategory) {
      return NextResponse.json({
        status: false,
        message: SUBCATEGORY_MESSAGES.NOT_FOUND,
        statusCode: 404
      }, { status: 404 });
    }

    return NextResponse.json({
      status: true,
      message: SUBCATEGORY_MESSAGES.DELETE_SUCCESS,
      statusCode: 200
    }, { status: 200 });

  } catch (error: any) {
    console.error(`Error deleting Sub Category:`, error);
    return NextResponse.json({
      status: false,
      message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: 500
    }, { status: 500 });
  }
});
