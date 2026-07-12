import { NextRequest, NextResponse } from 'next/server';
import CmsPage from '@/models/CmsPage';
import { withAdmin } from '@/lib/apiWrapper';
import { IUser } from '@/models/User';

// GET /api/admin/cms/pages — list all pages (admin sees all)
export const GET = withAdmin(async (_request: NextRequest, _user: IUser) => {
  try {
    const pages = await CmsPage.find({})
      .select('slug title metaDescription isPublished updatedAt')
      .sort({ slug: 1 })
      .lean();
    return NextResponse.json({ status: true, data: pages, statusCode: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

// POST /api/admin/cms/pages — create a new page
export const POST = withAdmin(async (request: NextRequest, _user: IUser) => {
  try {
    const body = await request.json();
    const { slug, title, metaDescription, content, isPublished } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { status: false, message: 'slug and title are required', statusCode: 400 },
        { status: 400 }
      );
    }

    const existing = await CmsPage.findOne({ slug: slug.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { status: false, message: `A page with slug "${slug}" already exists`, statusCode: 409 },
        { status: 409 }
      );
    }

    const page = await CmsPage.create({
      slug: slug.toLowerCase().trim(),
      title: title.trim(),
      metaDescription: metaDescription?.trim() || '',
      content: content || '',
      isPublished: isPublished !== false,
    });

    return NextResponse.json(
      { status: true, message: 'Page created successfully', data: page, statusCode: 201 },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
