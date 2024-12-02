import connectDB from "@/lib/connectDB";
import Group from "@/models/group.model";
import JoinedGroup from "@/models/joinedGroup.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();

        const { groupId, userId, type } = await req.json();

        if (!groupId || !userId || !type) {
            return NextResponse.json(
                { success: false, message: "All fields (groupId, userId, type) are required" },
                { status: 400 }
            );
        }

        if (!['collaborate', 'university', 'group', 'leetGroup', 'leetUniversity'].includes(type)) {
            return NextResponse.json(
                { success: false, message: "Invalid type value" },
                { status: 400 }
            );
        }

        const existingJoinedGroup = await JoinedGroup.findOne({ groupId, userId, type });

        if (existingJoinedGroup) {
            return NextResponse.json(
                { success: false, message: "User is already joined to this group" },
                { status: 400 }
            );
        }

        const onlyOneTypeGroupAllowed = await JoinedGroup.findOne({ userId, type });

        if (onlyOneTypeGroupAllowed) {
            return NextResponse.json(
                { success: false, message: "User is already joined to a group of this type" },
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

        group.membersCount = group.membersCount + 1;
        await group.save()

        const newJoinedGroup = new JoinedGroup({
            groupId,
            userId,
            type
        });

        await newJoinedGroup.save();

        return NextResponse.json(
            { success: true, message: "Group Joined", joinedGroup: newJoinedGroup },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error adding joined group:", error.message);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
};
