import connectDB from "@/lib/connectDB";
import Group from "@/models/group.model";
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

        
        const group = await Group.findById(groupId);


        if (!group) {
            return NextResponse.json(
                { success: false, message: "Group not found" },
                { status: 404 }
            );
        }

        group.membersCount = group.membersCount - 1;
        await group.save()


        const deletedGroup = await JoinedGroup.findOneAndDelete({ userId, groupId });

        if (!deletedGroup) {
            return NextResponse.json(
                { success: false, message: "Group not found or user is not part of this group" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Group Lefted" },
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
