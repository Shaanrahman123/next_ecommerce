import { NextRequest, NextResponse } from 'next/server';
import SuperCategory from '@/models/SuperCategory';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';
import { withDb } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { getCloudinaryUrl } from '@/lib/cloudinary';

export const GET = withDb(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const departmentSlug = searchParams.get('department');
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    const superFilter: Record<string, unknown> = activeOnly ? { isActive: true } : {};
    if (departmentSlug) superFilter.slug = departmentSlug;

    const departments = await SuperCategory.find(superFilter).sort({ sortOrder: 1, name: 1 });

    const tree = await Promise.all(
      departments.map(async (dept) => {
        const categoryFilter: Record<string, unknown> = {
          superCategories: dept._id,
          ...(activeOnly ? { isActive: true } : {}),
        };

        const groups = await Category.find(categoryFilter).sort({ sortOrder: 1, name: 1 });

        const sections = await Promise.all(
          groups.map(async (group) => {
            const subFilter: Record<string, unknown> = {
              category: group._id,
              ...(activeOnly ? { isActive: true } : {}),
            };

            const items = await SubCategory.find(subFilter).sort({ sortOrder: 1, name: 1 });

            return {
              id: group._id.toString(),
              title: group.name,
              slug: group.slug,
              description: group.description,
              image: group.image,
              imageUrl: getCloudinaryUrl(group.image, { width: 400, height: 400 }),
              basePath: `/products?department=${dept.slug}&category=${group.slug}`,
              items: items.map((item) => ({
                id: item._id.toString(),
                name: item.name,
                slug: item.slug,
                image: item.image,
                imageUrl: getCloudinaryUrl(item.image, { width: 200, height: 200 }),
              })),
            };
          })
        );

        return {
          id: dept._id.toString(),
          label: dept.name,
          slug: dept.slug,
          description: dept.description,
          image: dept.image,
          imageUrl: getCloudinaryUrl(dept.image, { width: 600, height: 800 }),
          basePath: `/products?department=${dept.slug}`,
          sections,
        };
      })
    );

    return NextResponse.json({
      status: true,
      message: 'Category tree fetched successfully',
      statusCode: 200,
      data: tree,
    });
  } catch (error: unknown) {
    console.error('Error fetching category tree:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
