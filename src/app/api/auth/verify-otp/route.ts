import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { AUTH_MESSAGES, GLOBAL_MESSAGES } from "@/constants/messages";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json({
                status: false,
                message: 'Email and OTP code are required',
                statusCode: 400
            }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user || !user.otp || !user.otpExpiry) {
            return NextResponse.json({
                status: false,
                message: AUTH_MESSAGES.INVALID_OTP,
                statusCode: 400
            }, { status: 400 });
        }

        // Check if OTP is expired
        if (new Date() > user.otpExpiry) {
            return NextResponse.json({
                status: false,
                message: AUTH_MESSAGES.EXPIRED_OTP,
                statusCode: 400
            }, { status: 400 });
        }

        // Check if OTP matches
        if (user.otp !== otp.trim()) {
            return NextResponse.json({
                status: false,
                message: AUTH_MESSAGES.INVALID_OTP,
                statusCode: 400
            }, { status: 400 });
        }

        return NextResponse.json({
            status: true,
            message: AUTH_MESSAGES.OTP_VERIFIED,
            statusCode: 200
        }, { status: 200 });

    } catch (error: any) {
        console.error("Verify OTP Error:", error);
        return NextResponse.json({
            status: false,
            message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
            statusCode: 500
        }, { status: 500 });
    }
}
