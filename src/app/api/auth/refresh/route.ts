import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken, setAuthCookies } from "@/lib/jwt";
import { AUTH_MESSAGES, GLOBAL_MESSAGES } from "@/constants/messages";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const cookieStore = await cookies();
        const refreshTokenCookie = cookieStore.get('refreshToken');

        if (!refreshTokenCookie || !refreshTokenCookie.value) {
            return NextResponse.json({
                status: false,
                message: AUTH_MESSAGES.NO_REFRESH_TOKEN,
                statusCode: 401
            }, { status: 401 });
        }

        const payload = verifyToken(refreshTokenCookie.value);

        if (!payload || !payload.userId) {
            return NextResponse.json({
                status: false,
                message: AUTH_MESSAGES.INVALID_REFRESH_TOKEN,
                statusCode: 401
            }, { status: 401 });
        }

        // Find user in database
        const user = await User.findById(payload.userId);

        if (!user) {
            return NextResponse.json({
                status: false,
                message: AUTH_MESSAGES.USER_NOT_FOUND,
                statusCode: 401
            }, { status: 401 });
        }

        // Issue new access and refresh tokens and refresh the cookies
        await setAuthCookies(user._id.toString(), user.email);

        return NextResponse.json({
            status: true,
            message: 'Session token refreshed successfully', // or simple success text
            statusCode: 200,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                loginType: user.loginType
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error("Token Refresh Error:", error);
        return NextResponse.json({
            status: false,
            message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
            statusCode: 500
        }, { status: 500 });
    }
}
export async function GET(request: NextRequest) {
    return POST(request);
}
