import { NextRequest, NextResponse } from 'next/server';
import dbConnect from './dbConnect';
import { getAdminUser } from './authMiddleware';
import { IUser } from '@/models/User';

type RouteHandler = (request: NextRequest, ...args: any[]) => Promise<NextResponse> | NextResponse;
type AuthenticatedRouteHandler = (request: NextRequest, user: IUser, ...args: any[]) => Promise<NextResponse> | NextResponse;

/**
 * Higher-Order Function that automatically ensures a database connection
 * is established before executing the route handler.
 */
export function withDb(handler: RouteHandler) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      await dbConnect();
      return await handler(request, ...args);
    } catch (error: any) {
      console.error('[API WRAPPER] Database connection failed:', error);
      return NextResponse.json({
        status: false,
        message: 'Database connection failed',
        statusCode: 500
      }, { status: 500 });
    }
  };
}

/**
 * Higher-Order Function that connects to the database and restricts
 * execution to administrators only.
 */
export function withAdmin(handler: AuthenticatedRouteHandler) {
  return withDb(async (request: NextRequest, ...args: any[]) => {
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({
        status: false,
        message: 'Access denied. Administrator privileges required.',
        statusCode: 403
      }, { status: 403 });
    }

    return await handler(request, adminUser, ...args);
  });
}
