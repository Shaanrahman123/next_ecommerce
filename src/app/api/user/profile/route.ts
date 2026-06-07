import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/apiWrapper';
import { serializeUserProfile } from '@/lib/userSerializer';
import { AUTH_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { IUser } from '@/models/User';

export const GET = withAuth(async (_request: NextRequest, user: IUser) => {
  return NextResponse.json({
    status: true,
    message: 'Profile fetched successfully',
    statusCode: 200,
    user: serializeUserProfile(user),
  });
});

export const PATCH = withAuth(async (request: NextRequest, user: IUser) => {
  try {
    const body = await request.json();
    const { firstName, lastName } = body;

    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json(
        { status: false, message: AUTH_MESSAGES.NAME_REQUIRED, statusCode: 400 },
        { status: 400 }
      );
    }

    user.firstName = firstName.trim();
    user.lastName = lastName.trim();
    await user.save();

    return NextResponse.json({
      status: true,
      message: AUTH_MESSAGES.PROFILE_UPDATE_SUCCESS,
      statusCode: 200,
      user: serializeUserProfile(user),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
