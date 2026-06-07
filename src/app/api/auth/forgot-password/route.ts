import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendOTPEmail } from "@/lib/email";
import { AUTH_MESSAGES, GLOBAL_MESSAGES } from "@/constants/messages";
import { LOGIN_TYPES } from "@/types";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({
                status: false,
                message: AUTH_MESSAGES.EMAIL_REQUIRED,
                statusCode: 400
            }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return NextResponse.json({
                status: false,
                message: AUTH_MESSAGES.EMAIL_NOT_FOUND,
                statusCode: 404
            }, { status: 404 });
        }

        // Only allow forgot password for direct accounts
        if (user.loginType !== LOGIN_TYPES.DIRECT && !user.password) {
            return NextResponse.json({
                status: false,
                message: `This account is registered via ${user.loginType}. Please log in using that provider.`,
                statusCode: 400
            }, { status: 400 });
        }

        // Generate 6-digit numeric OTP code
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Expiry in 10 minutes
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send OTP email
        await sendOTPEmail(normalizedEmail, otp);

        return NextResponse.json({
            status: true,
            message: AUTH_MESSAGES.OTP_SENT,
            statusCode: 200
        }, { status: 200 });

    } catch (error: any) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({
            status: false,
            message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
            statusCode: 500
        }, { status: 500 });
    }
}
