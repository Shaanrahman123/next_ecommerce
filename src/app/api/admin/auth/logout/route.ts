import { NextRequest, NextResponse } from 'next/server';
import { clearAdminAuthCookies } from '@/lib/jwt';
import { ADMIN_AUTH_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';

export async function POST(_request: NextRequest) {
  try {
    await clearAdminAuthCookies();
    return NextResponse.json({
      status: true,
      message: ADMIN_AUTH_MESSAGES.LOGOUT_SUCCESS,
      statusCode: 200,
    });
  } catch (error: unknown) {
    console.error('Admin Logout Error:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
