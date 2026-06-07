import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken, setAdminAuthCookies } from '@/lib/jwt';
import { serializeAdminUser } from '@/lib/adminAuth';
import { ADMIN_AUTH_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';

export async function POST(_request: NextRequest) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get('adminRefreshToken');

    if (!refreshTokenCookie?.value) {
      return NextResponse.json(
        { status: false, message: ADMIN_AUTH_MESSAGES.NO_REFRESH_TOKEN, statusCode: 401 },
        { status: 401 }
      );
    }

    const payload = verifyToken(refreshTokenCookie.value);
    if (!payload?.userId) {
      return NextResponse.json(
        { status: false, message: ADMIN_AUTH_MESSAGES.INVALID_REFRESH_TOKEN, statusCode: 401 },
        { status: 401 }
      );
    }

    const user = await User.findById(payload.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { status: false, message: ADMIN_AUTH_MESSAGES.ACCESS_DENIED, statusCode: 401 },
        { status: 401 }
      );
    }

    await setAdminAuthCookies(user._id.toString(), user.email);

    return NextResponse.json({
      status: true,
      message: 'Admin session refreshed successfully',
      statusCode: 200,
      user: serializeAdminUser(user),
    });
  } catch (error: unknown) {
    console.error('Admin Token Refresh Error:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
