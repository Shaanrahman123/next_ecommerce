import { NextRequest, NextResponse } from 'next/server';
import CmsPage from '@/models/CmsPage';
import { withDb, withAdmin } from '@/lib/apiWrapper';
import { IUser } from '@/models/User';

type RouteContext = { params: Promise<{ slug: string }> };

// GET /api/cms/pages/[slug] — Public: get a single page by slug
export const GET = withDb(async (_request: NextRequest, context: RouteContext) => {
  try {
    const { slug } = await context.params;
    const page = await CmsPage.findOne({ slug: slug.toLowerCase() }).lean();
    if (!page) {
      return NextResponse.json(
        { status: false, message: 'Page not found', statusCode: 404 },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: true, data: page, statusCode: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

// PUT /api/cms/pages/[slug] — Admin: update a page
export const PUT = withAdmin(async (request: NextRequest, _user: IUser, context: RouteContext) => {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const { title, metaDescription, content, isPublished } = body;

    const page = await CmsPage.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      {
        ...(title !== undefined && { title: title.trim() }),
        ...(metaDescription !== undefined && { metaDescription: metaDescription.trim() }),
        ...(content !== undefined && { content }),
        ...(isPublished !== undefined && { isPublished }),
      },
      { new: true, runValidators: true }
    );

    if (!page) {
      return NextResponse.json(
        { status: false, message: 'Page not found', statusCode: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: true, message: 'Page updated successfully', data: page, statusCode: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

// DELETE /api/cms/pages/[slug] — Admin: delete a page
export const DELETE = withAdmin(async (_request: NextRequest, _user: IUser, context: RouteContext) => {
  try {
    const { slug } = await context.params;
    const page = await CmsPage.findOneAndDelete({ slug: slug.toLowerCase() });
    if (!page) {
      return NextResponse.json(
        { status: false, message: 'Page not found', statusCode: 404 },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: true, message: 'Page deleted successfully', statusCode: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
