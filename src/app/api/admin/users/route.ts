import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { withAdmin } from '@/lib/apiWrapper';
import { USER_ADMIN_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { serializeUserList } from '@/lib/userSerializer';

const USER_LIST_SELECT = '-password -otp -otpExpiry';

export const GET = withAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '12', 10));
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');
    const verified = searchParams.get('verified');
    const loginType = searchParams.get('loginType');

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (role === 'user' || role === 'admin') filter.role = role;
    if (verified === 'true' || verified === 'false') filter.isVerified = verified === 'true';
    if (loginType === 'direct' || loginType === 'social') filter.loginType = loginType;

    const skip = (page - 1) * limit;

    const [docs, totalDocs, statsAgg] = await Promise.all([
      User.find(filter).select(USER_LIST_SELECT).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
      User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            customers: { $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] } },
            admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
            verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
            directLogin: { $sum: { $cond: [{ $eq: ['$loginType', 'direct'] }, 1, 0] } },
            socialLogin: { $sum: { $cond: [{ $eq: ['$loginType', 'social'] }, 1, 0] } },
          },
        },
      ]),
    ]);

    const totals = statsAgg[0] || {
      total: 0,
      customers: 0,
      admins: 0,
      verified: 0,
      directLogin: 0,
      socialLogin: 0,
    };

    const totalPages = Math.ceil(totalDocs / limit);

    return NextResponse.json({
      status: true,
      message: USER_ADMIN_MESSAGES.FETCH_SUCCESS,
      statusCode: 200,
      data: serializeUserList(docs as unknown as Record<string, unknown>[]),
      stats: {
        total: totals.total,
        customers: totals.customers,
        admins: totals.admins,
        verified: totals.verified,
        unverified: totals.total - totals.verified,
        directLogin: totals.directLogin,
        socialLogin: totals.socialLogin,
      },
      meta: {
        totalDocs,
        limit,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
