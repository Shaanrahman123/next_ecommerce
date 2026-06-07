import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendOTPEmail } from '@/lib/email';
import { generateOtp, getOtpExpiry } from '@/lib/adminAuth';
import { ADMIN_AUTH_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { LOGIN_TYPES } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { status: false, message: ADMIN_AUTH_MESSAGES.EMAIL_REQUIRED, statusCode: 400 },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail, role: 'admin' });

    if (!user) {
      return NextResponse.json(
        { status: false, message: ADMIN_AUTH_MESSAGES.EMAIL_NOT_FOUND, statusCode: 404 },
        { status: 404 }
      );
    }

    if (user.loginType !== LOGIN_TYPES.DIRECT && !user.password) {
      return NextResponse.json(
        { status: false, message: ADMIN_AUTH_MESSAGES.INVALID_CREDENTIALS, statusCode: 400 },
        { status: 400 }
      );
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = getOtpExpiry();
    await user.save();

    await sendOTPEmail(normalizedEmail, otp);

    return NextResponse.json({
      status: true,
      message: ADMIN_AUTH_MESSAGES.OTP_SENT,
      statusCode: 200,
    });
  } catch (error: unknown) {
    console.error('Admin Forgot Password Error:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
}
