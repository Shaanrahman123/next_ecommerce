import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { ADMIN_AUTH_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, token, password } = body;

    if (!email || !token || !password) {
      return NextResponse.json(
        { status: false, message: ADMIN_AUTH_MESSAGES.FIELDS_REQUIRED, statusCode: 400 },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { status: false, message: ADMIN_AUTH_MESSAGES.PASSWORD_LENGTH, statusCode: 400 },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail, role: 'admin' });

    if (!user || !user.otp || !user.otpExpiry) {
      return NextResponse.json(
        { status: false, message: 'Invalid password reset request', statusCode: 400 },
        { status: 400 }
      );
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json(
        { status: false, message: ADMIN_AUTH_MESSAGES.EXPIRED_OTP, statusCode: 400 },
        { status: 400 }
      );
    }

    if (user.otp !== token.trim()) {
      return NextResponse.json(
        { status: false, message: ADMIN_AUTH_MESSAGES.INVALID_OTP, statusCode: 400 },
        { status: 400 }
      );
    }

    user.password = password;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return NextResponse.json({
      status: true,
      message: ADMIN_AUTH_MESSAGES.RESET_SUCCESS,
      statusCode: 200,
    });
  } catch (error: unknown) {
    console.error('Admin Reset Password Error:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
}
