import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { AUTH_MESSAGES, GLOBAL_MESSAGES } from "@/constants/messages";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { email, token, password } = body;

        if (!email || !token || !password) {
            return NextResponse.json({
                status: false,
                message: AUTH_MESSAGES.FIELDS_REQUIRED,
                statusCode: 400
            }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({
                status: false,
                message: AUTH_MESSAGES.PASSWORD_LENGTH,
                statusCode: 400
            }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user || !user.otp || !user.otpExpiry) {
            return NextResponse.json({
                status: false,
                message: 'Invalid password reset request',
                statusCode: 400
            }, { status: 400 });
        }

        // Verify OTP is still valid (not expired)
        if (new Date() > user.otpExpiry) {
            return NextResponse.json({
                status: false,
                message: AUTH_MESSAGES.EXPIRED_OTP,
                statusCode: 400
            }, { status: 400 });
        }

        // Verify OTP matches
        if (user.otp !== token.trim()) {
            return NextResponse.json({
                status: false,
                message: AUTH_MESSAGES.INVALID_OTP,
                statusCode: 400
            }, { status: 400 });
        }

        // Reset password
        user.password = password;
        
        // Clear OTP fields
        user.otp = undefined;
        user.otpExpiry = undefined;
        
        await user.save();

        return NextResponse.json({
            status: true,
            message: AUTH_MESSAGES.RESET_SUCCESS,
            statusCode: 200
        }, { status: 200 });

    } catch (error: any) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({
            status: false,
            message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
            statusCode: 500
        }, { status: 500 });
    }
}
