import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'E-coommmeeeisweu6327';
const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m';
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRATION as any,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION as any,
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function setAuthCookies(userId: string, email: string) {
  const payload: TokenPayload = { userId, email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const cookieStore = await cookies();

  // Set Access Token cookie: 15 minutes (or whatever is in env)
  // Let's extract maxAge in seconds. 15m = 900 seconds. 7d = 604800 seconds.
  const accessMaxAge = parseExpirationToSeconds(JWT_ACCESS_EXPIRATION) || 900;
  const refreshMaxAge = parseExpirationToSeconds(JWT_REFRESH_EXPIRATION) || 604800;

  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: accessMaxAge,
  });

  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: refreshMaxAge,
  });

  return { accessToken, refreshToken };
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', '', { maxAge: 0, path: '/' });
  cookieStore.set('refreshToken', '', { maxAge: 0, path: '/' });
}

export async function setAdminAuthCookies(userId: string, email: string) {
  const payload: TokenPayload = { userId, email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const cookieStore = await cookies();
  const accessMaxAge = parseExpirationToSeconds(JWT_ACCESS_EXPIRATION) || 900;
  const refreshMaxAge = parseExpirationToSeconds(JWT_REFRESH_EXPIRATION) || 604800;

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };

  cookieStore.set('adminAccessToken', accessToken, { ...cookieOptions, maxAge: accessMaxAge });
  cookieStore.set('adminRefreshToken', refreshToken, { ...cookieOptions, maxAge: refreshMaxAge });

  return { accessToken, refreshToken };
}

export async function clearAdminAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.set('adminAccessToken', '', { maxAge: 0, path: '/' });
  cookieStore.set('adminRefreshToken', '', { maxAge: 0, path: '/' });
}

function parseExpirationToSeconds(exp: string): number | null {
  const num = parseInt(exp);
  if (isNaN(num)) return null;

  const unit = exp.slice(num.toString().length).toLowerCase().trim();
  switch (unit) {
    case 's':
      return num;
    case 'm':
      return num * 60;
    case 'h':
      return num * 60 * 60;
    case 'd':
      return num * 24 * 60 * 60;
    default:
      return num;
  }
}
