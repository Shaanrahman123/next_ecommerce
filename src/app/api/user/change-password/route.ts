import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/apiWrapper';
import { serializeUserProfile } from '@/lib/userSerializer';
import { AUTH_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { IUser } from '@/models/User';
import { LOGIN_TYPES } from '@/types';

export const POST = withAuth(async (request: NextRequest, user: IUser) => {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { status: false, message: 'Current and new password are required', statusCode: 400 },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { status: false, message: AUTH_MESSAGES.PASSWORD_LENGTH, statusCode: 400 },
        { status: 400 }
      );
    }

    if (user.loginType !== LOGIN_TYPES.DIRECT || !user.password) {
      return NextResponse.json(
        { status: false, message: 'Password change is not available for social login accounts', statusCode: 400 },
        { status: 400 }
      );
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json(
        { status: false, message: AUTH_MESSAGES.CURRENT_PASSWORD_INCORRECT, statusCode: 400 },
        { status: 400 }
      );
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json({
      status: true,
      message: AUTH_MESSAGES.PASSWORD_CHANGE_SUCCESS,
      statusCode: 200,
      user: serializeUserProfile(user),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
