import connectDB from '@/lib/connectDB';
import User from '@/models/user.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface TokenPayload extends JwtPayload {
    _id: string;
    username: string;
}

export const GET = async (req: NextRequest) => {
    await connectDB();

    const accessToken = (await cookies()).get("accessToken")?.value || "";
    const refreshToken = (await cookies()).get("refreshToken")?.value || "";

    const tokenSecret = process.env.TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!tokenSecret || !refreshTokenSecret) {
        return NextResponse.json({
            message: "Token secrets are not defined"
        }, { status: 500 });
    }

    const generateTokens = (userId: string, username: string) => {
        const newAccessToken = jwt.sign(
            { _id: userId, username },
            tokenSecret,
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { _id: userId, username },
            refreshTokenSecret,
            { expiresIn: "30d" }
        );

        return { newAccessToken, newRefreshToken };
    };

    try {
        const decodedAccessToken = jwt.verify(accessToken, tokenSecret) as TokenPayload;

        if (!decodedAccessToken._id) {
            throw new Error("Invalid access token payload");
        }

        const userId = decodedAccessToken._id;

        const user = await User.findById(userId).select("-password -updatedAt -createdAt -verifyCode -verifyCodeExpiry");
        if (!user) {
            return NextResponse.json(
                { error: `No user found by id ${userId}` },
                { status: 404 }
            );
        }

        return NextResponse.json({ user, message: "Session active" }, { status: 200 });

    } catch (accessTokenError) {
        try {
            const decodedRefreshToken = jwt.verify(refreshToken, refreshTokenSecret) as TokenPayload;

            if (!decodedRefreshToken._id || !decodedRefreshToken.username) {
                throw new Error("Invalid refresh token payload");
            }

            const userId = decodedRefreshToken._id;
            const username = decodedRefreshToken.username;

            const user = await User.findById(userId).select("-password -updatedAt -createdAt -verifyCode -verifyCodeExpiry");

            if (!user) {
                return NextResponse.json(
                    { error: `No user found by id ${userId}` },
                    { status: 404 }
                );
            }

            const { newAccessToken, newRefreshToken } = generateTokens(userId, username);

            const response = NextResponse.json({ user, message: "Session refreshed" }, { status: 200 });

            response.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 15 * 60, 
            });

            response.cookies.set("refreshToken", newRefreshToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60, 
            });

            return response;

        } catch (refreshTokenError) {
            return NextResponse.json({ error: 'Invalid session. Please log in again.' }, { status: 401 });
        }
    }
};
