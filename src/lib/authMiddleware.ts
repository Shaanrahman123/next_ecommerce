import { cookies } from 'next/headers';
import dbConnect from './dbConnect';
import { verifyToken, setAuthCookies } from './jwt';
import User, { IUser } from '@/models/User';

export async function getAuthenticatedUser(): Promise<IUser | null> {
  try {
    await dbConnect();

    const cookieStore = await cookies();

    // 1. Try the access token first
    const accessTokenCookie = cookieStore.get('accessToken');
    if (accessTokenCookie?.value) {
      const payload = verifyToken(accessTokenCookie.value);
      if (payload?.userId) {
        const user = await User.findById(payload.userId);
        if (user) return user;
      }
    }

    // 2. Access token missing / expired — silently try the refresh token
    const refreshTokenCookie = cookieStore.get('refreshToken');
    if (!refreshTokenCookie?.value) return null;

    const refreshPayload = verifyToken(refreshTokenCookie.value);
    if (!refreshPayload?.userId) return null;

    const user = await User.findById(refreshPayload.userId);
    if (!user) return null;

    // Re-issue fresh cookies so subsequent requests work
    await setAuthCookies(user._id.toString(), user.email);

    return user;
  } catch (error) {
    console.error('[AUTH] User authorization helper failed:', error);
    return null;
  }
}

export async function getAdminUser(): Promise<IUser | null> {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('adminAccessToken');

    if (!tokenCookie?.value) return null;

    const payload = verifyToken(tokenCookie.value);
    if (!payload?.userId) return null;

    const user = await User.findById(payload.userId);
    if (!user || user.role !== 'admin') return null;

    return user;
  } catch (error) {
    console.error('[AUTH] Admin authorization helper failed:', error);
    return null;
  }
}
