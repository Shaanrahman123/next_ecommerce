import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/jwt";
import { AUTH_MESSAGES, GLOBAL_MESSAGES } from "@/constants/messages";

export async function POST(request: NextRequest) {
    try {
        await clearAuthCookies();
        return NextResponse.json({
            status: true,
            message: AUTH_MESSAGES.LOGOUT_SUCCESS,
            statusCode: 200
        }, { status: 200 });
    } catch (error: any) {
        console.error("Logout Error:", error);
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
