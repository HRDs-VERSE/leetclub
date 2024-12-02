import connectDB from "@/lib/connectDB";
import Group from "@/models/group.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();

        const { name, type, adminId, tagLine } = await req.json();

        
        if (!['collaborate', 'university', 'group'].includes(type)) {
            return NextResponse.json(
                { success: false, message: "Invalid type value" },
                { status: 400 }
            );
        }

        if (!name || !type || !adminId) {
            return NextResponse.json(
                { success: false, message: "Name, type, and adminId are required" },
                { status: 400 }
            );
        }

        const existingGroup = await Group.findOne({ name });

        if(existingGroup) {
            return NextResponse.json(
                { success: false, message: "Group with this name already exists" },
                { status: 400 }
            );
        }

        const group = new Group({
            name,
            type,
            adminId,
            tagLine: tagLine || "",
        });

        await group.save();

        return NextResponse.json(
            { success: true, message: "Group created successfully", group },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error creating group:", error.message);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
};
