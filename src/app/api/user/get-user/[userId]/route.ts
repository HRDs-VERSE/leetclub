import connectDB from "@/lib/connectDB";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    params: {
        userId: string;
    };
};

export const GET = async (req: NextRequest, { params }: Params) => {
    try {
        connectDB();
        
        const { userId } = await params;

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
            { message: "User Found successfull", user },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'An error occurred while fetching the user data' },
            { status: 500 }
        );
    }
};