import connectDB from "@/lib/connectDB";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
    try {
        await connectDB();

        const userId = req.nextUrl.searchParams.get("userId");
        if (!userId) {
            return NextResponse.json(
                { error: "userId not given" },
                { status: 400 }
            );
        }

        const user = await User.findById(userId)

        if (!user) {
            return NextResponse.json(
                { error: `No user found with id ${userId}` },
                { status: 404 }
            );
        }

        user.newUserInfoDone = true
        await user.save()

        return NextResponse.json(
            {succes: false, message: "User toggled" },
            { status: 200 }
        );
    } catch (error) {
        // Handle server errors
        return NextResponse.json(
            { error: 'An error occurred while fetching the user data' },
            { status: 500 }
        );
    }
};
