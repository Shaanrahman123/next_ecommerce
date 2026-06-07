import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendOTPEmail } from '@/lib/email';
import { AUTH_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { LOGIN_TYPES } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { status: false, message: AUTH_MESSAGES.EMAIL_REQUIRED, statusCode: 400 },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { status: true, message: AUTH_MESSAGES.RESEND_OTP_SUCCESS, statusCode: 200 },
        { status: 200 }
      );
    }

    if (user.loginType !== LOGIN_TYPES.DIRECT && !user.password) {
      return NextResponse.json(
        {
          status: false,
          message: `This account is registered via ${user.loginType}. Please log in using that provider.`,
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPEmail(normalizedEmail, otp);

    return NextResponse.json(
      { status: true, message: AUTH_MESSAGES.RESEND_OTP_SUCCESS, statusCode: 200 },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Resend OTP Error:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json(
      { status: false, message, statusCode: 500 },
      { status: 500 }
    );
  }
}
