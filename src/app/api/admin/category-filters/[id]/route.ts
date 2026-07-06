import { NextRequest, NextResponse } from 'next/server';
import CategoryFilterField from '@/models/CategoryFilterField';
import { withAdmin } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';

export const PUT = withAdmin(async (
  request: NextRequest,
  _admin,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await request.json();

    const field = await CategoryFilterField.findById(id);
    if (!field) {
      return NextResponse.json({ status: false, message: 'Filter field not found', statusCode: 404 }, { status: 404 });
    }

    if (body.label !== undefined) field.label = String(body.label).trim();
    if (body.sortOrder !== undefined) field.sortOrder = Number(body.sortOrder) || 0;
    if (body.isActive !== undefined) field.isActive = Boolean(body.isActive);

    await field.save();

    return NextResponse.json({
      status: true,
      message: 'Filter field updated',
      statusCode: 200,
      data: field,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const DELETE = withAdmin(async (
  _request: NextRequest,
  _admin,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const deleted = await CategoryFilterField.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ status: false, message: 'Filter field not found', statusCode: 404 }, { status: 404 });
    }
    return NextResponse.json({ status: true, message: 'Filter field deleted', statusCode: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
