import connectDB from "@/lib/connectDB";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    try {
        await connectDB();

        const { userId } = params;

        if (!userId) {
            return NextResponse.json(
                { error: "userId not given" },
                { status: 400 }
            );
        }

        const user = await User.findById(userId).select("-password -updatedAt -createdAt -verifyTokenExpiry -verifyToken -oAuthUID");

        if (!user) {
            return NextResponse.json(
                { error: `No user found with id ${userId}` },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "User found successfully", user },
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
