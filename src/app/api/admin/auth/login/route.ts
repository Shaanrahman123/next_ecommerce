import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { setAdminAuthCookies } from '@/lib/jwt';
import { serializeAdminUser } from '@/lib/adminAuth';
import { ADMIN_AUTH_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { LOGIN_TYPES } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json(
        { status: false, message: ADMIN_AUTH_MESSAGES.EMAIL_REQUIRED, statusCode: 400 },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { status: false, message: 'Password is required', statusCode: 400 },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { status: false, message: ADMIN_AUTH_MESSAGES.INVALID_CREDENTIALS, statusCode: 401 },
        { status: 401 }
      );
    }

    if (user.loginType !== LOGIN_TYPES.DIRECT || !user.password) {
      return NextResponse.json(
        { status: false, message: ADMIN_AUTH_MESSAGES.INVALID_CREDENTIALS, statusCode: 401 },
        { status: 401 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { status: false, message: ADMIN_AUTH_MESSAGES.INVALID_CREDENTIALS, statusCode: 401 },
        { status: 401 }
      );
    }

    await setAdminAuthCookies(user._id.toString(), user.email);

    return NextResponse.json({
      status: true,
      message: ADMIN_AUTH_MESSAGES.LOGIN_SUCCESS,
      statusCode: 200,
      user: serializeAdminUser(user),
    });
  } catch (error: unknown) {
    console.error('Admin Login Error:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
}
