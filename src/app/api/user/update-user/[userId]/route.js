import connectDB from "@/lib/connectDB";
import User from "@/models/user.model";
import { NextResponse } from "next/server";


export const PATCH = async (req, { params }) => {
    try {
        await connectDB();

        const { userId } = await params;
        const { competitivePlatforms } = await req.json(); 
        
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID is required" },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Update the competitivePlatforms array
        user.competitivePlatforms = competitivePlatforms;

        const updatedUser = await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "User updated successfully",
                updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user:", error.message);

        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
};
