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
        const { firstName, lastName, email, password, loginType = LOGIN_TYPES.DIRECT, phone } = body;

        // Basic fields check
        if (!email) {
            return NextResponse.json({
                status: false,
                message: AUTH_MESSAGES.EMAIL_REQUIRED,
                statusCode: 400
            }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // 1. Direct Registration (Email + Password)
        if (loginType === LOGIN_TYPES.DIRECT) {
            if (!password || password.length < 6) {
                return NextResponse.json({
                    status: false,
                    message: AUTH_MESSAGES.PASSWORD_LENGTH,
                    statusCode: 400
                }, { status: 400 });
            }

            if (!firstName || !lastName) {
                return NextResponse.json({
                    status: false,
                    message: AUTH_MESSAGES.NAME_REQUIRED,
                    statusCode: 400
                }, { status: 400 });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email: normalizedEmail });
            if (existingUser) {
                return NextResponse.json({
                    status: false,
                    message: AUTH_MESSAGES.EMAIL_EXISTS,
                    statusCode: 400
                }, { status: 400 });
            }

            // Create new user
            const newUser = new User({
                firstName,
                lastName,
                email: normalizedEmail,
                password,
                phone,
                loginType: LOGIN_TYPES.DIRECT,
                isVerified: false
            });

            await newUser.save();

            // Issue JWTs and set cookies
            await setAuthCookies(newUser._id.toString(), newUser.email);

            return NextResponse.json({
                status: true,
                message: AUTH_MESSAGES.SIGNUP_SUCCESS,
                statusCode: 201,
                user: {
                    id: newUser._id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    phone: newUser.phone,
                    loginType: newUser.loginType,
                    createdAt: newUser.createdAt
                }
            }, { status: 201 });
        } 
        
        // 2. Social Registration (Google, Facebook, Apple)
        else if (loginType === LOGIN_TYPES.SOCIAL) {
            // Check if email already registered
            let user = await User.findOne({ email: normalizedEmail });

            if (user) {
                // Issue JWTs and set cookies (essentially logging them in)
                await setAuthCookies(user._id.toString(), user.email);

                return NextResponse.json({
                    status: true,
                    message: AUTH_MESSAGES.SOCIAL_LOGIN_SUCCESS,
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

            // Create new social user
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

            // Issue JWTs and set cookies
            await setAuthCookies(newSocialUser._id.toString(), newSocialUser.email);

            return NextResponse.json({
                status: true,
                message: AUTH_MESSAGES.SOCIAL_SIGNUP_SUCCESS,
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
        } else {
            return NextResponse.json({
                status: false,
                message: GLOBAL_MESSAGES.INVALID_REGISTRATION_TYPE,
                statusCode: 400
            }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Sign-up Error:", error);
        return NextResponse.json({
            status: false,
            message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
            statusCode: 500
        }, { status: 500 });
    }
}