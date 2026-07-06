import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { withAdmin } from '@/lib/apiWrapper';
import { USER_ADMIN_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { serializeUser } from '@/lib/userSerializer';

const USER_DETAIL_SELECT = '-password -otp -otpExpiry';

export const GET = withAdmin(async (
  _request: NextRequest,
  _admin,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const user = await User.findById(id).select(USER_DETAIL_SELECT);

    if (!user) {
      return NextResponse.json(
        { status: false, message: USER_ADMIN_MESSAGES.NOT_FOUND, statusCode: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      message: USER_ADMIN_MESSAGES.FETCH_SUCCESS,
      statusCode: 200,
      data: serializeUser(user.toObject() as unknown as Record<string, unknown>),
    });
  } catch (error: unknown) {
    console.error('Error fetching user:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const PATCH = withAdmin(async (
  request: NextRequest,
  _admin,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isVerified } = body;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { status: false, message: USER_ADMIN_MESSAGES.NOT_FOUND, statusCode: 404 },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (typeof isVerified === 'boolean') updateData.isVerified = isVerified;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { status: false, message: 'No valid fields to update', statusCode: 400 },
        { status: 400 }
      );
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select(USER_DETAIL_SELECT);

    return NextResponse.json({
      status: true,
      message: USER_ADMIN_MESSAGES.UPDATE_SUCCESS,
      statusCode: 200,
      data: serializeUser(updated!.toObject() as unknown as Record<string, unknown>),
    });
  } catch (error: unknown) {
    console.error('Error updating user:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
