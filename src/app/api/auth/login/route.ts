import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Simulate authentication logic
        if (email === "user@example.com" && password === "password") {
            return NextResponse.json({
                status: true,
                message: 'Login successful',
                statusCode: 200
            });
        } else {
            return NextResponse.json({
                status: false,
                message: 'Invalid email or password',
                statusCode: 401
            });
        }
    } catch (error) {
        return NextResponse.json({
            status: false,
            message: 'Internal Server Error',
            statusCode: 500
        })

    }
}