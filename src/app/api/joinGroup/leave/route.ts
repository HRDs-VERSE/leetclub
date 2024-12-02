import connectDB from "@/lib/connectDB";
import JoinedGroup from "@/models/joinedGroup.model";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
    try {
        await connectDB();

        const { userId, groupId } = await req.json();

        if (!userId || !groupId) {
            return NextResponse.json(
                { success: false, message: "Both userId and groupId are required" },
                { status: 400 }
            );
        }

        const deletedGroup = await JoinedGroup.findOneAndDelete({ userId, groupId });

        if (!deletedGroup) {
            return NextResponse.json(
                { success: false, message: "Group not found or user is not part of this group" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Successfully left the group" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error leaving group:", error.message);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
};
