import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { setAuthCookies } from "@/lib/jwt";
import { AUTH_MESSAGES, GLOBAL_MESSAGES } from "@/constants/messages";
import { LOGIN_TYPES } from "@/types";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { email, password, loginType = LOGIN_TYPES.DIRECT, firstName, lastName } = body;

        if (!email) {
            return NextResponse.json({
                status: false,
                message: AUTH_MESSAGES.EMAIL_REQUIRED,
                statusCode: 400
            }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // 1. Direct Login
        if (loginType === LOGIN_TYPES.DIRECT) {
            if (!password) {
                return NextResponse.json({
                    status: false,
                    message: 'Password is required',
                    statusCode: 400
                }, { status: 400 });
            }

            // Find user
            const user = await User.findOne({ email: normalizedEmail });
            if (!user) {
                return NextResponse.json({
                    status: false,
                    message: AUTH_MESSAGES.INVALID_CREDENTIALS,
                    statusCode: 401
                }, { status: 401 });
            }

            // Check if user has a password set (social signups might not have one initially)
            if (!user.password) {
                return NextResponse.json({
                    status: false,
                    message: AUTH_MESSAGES.SOCIAL_LOGIN_REQUIRED(user.loginType),
                    statusCode: 401
                }, { status: 401 });
            }

            // Verify password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return NextResponse.json({
                    status: false,
                    message: AUTH_MESSAGES.INVALID_CREDENTIALS,
                    statusCode: 401
                }, { status: 401 });
            }

            // Issue JWTs and set cookies
            await setAuthCookies(user._id.toString(), user.email);

            return NextResponse.json({
                status: true,
                message: AUTH_MESSAGES.LOGIN_SUCCESS,
                statusCode: 200,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    loginType: user.loginType,
                    createdAt: user.createdAt
                }
            }, { status: 200 });
        } 
        
        // 2. Social Login
        else if (loginType === LOGIN_TYPES.SOCIAL) {
            let user = await User.findOne({ email: normalizedEmail });

            // If user exists, log them in directly
            if (user) {
                await setAuthCookies(user._id.toString(), user.email);

                return NextResponse.json({
                    status: true,
                    message: AUTH_MESSAGES.LOGIN_SUCCESS,
                    statusCode: 200,
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
                        loginType: user.loginType,
                        createdAt: user.createdAt
                    }
                }, { status: 200 });
            } 
            
            // If user does not exist, perform Auto-Signup (without password)
            else {
                const finalFirstName = firstName || 'Social';
                const finalLastName = lastName || 'User';

                const newSocialUser = new User({
                    firstName: finalFirstName,
                    lastName: finalLastName,
                    email: normalizedEmail,
                    loginType: LOGIN_TYPES.SOCIAL,
                    isVerified: true
                });

                await newSocialUser.save();

                await setAuthCookies(newSocialUser._id.toString(), newSocialUser.email);

                return NextResponse.json({
                    status: true,
                    message: AUTH_MESSAGES.SOCIAL_LOGIN_SUCCESS,
                    statusCode: 201,
                    user: {
                        id: newSocialUser._id,
                        firstName: newSocialUser.firstName,
                        lastName: newSocialUser.lastName,
                        email: newSocialUser.email,
                        phone: newSocialUser.phone,
                        loginType: newSocialUser.loginType,
                        createdAt: newSocialUser.createdAt
                    }
                }, { status: 201 });
            }
        } else {
            return NextResponse.json({
                status: false,
                message: GLOBAL_MESSAGES.INVALID_LOGIN_TYPE,
                statusCode: 400
            }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json({
            status: false,
            message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
            statusCode: 500
        }, { status: 500 });
    }
}