import connectDB from "@/lib/connectDB";
import Group from "@/models/group.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        const adminId = req.nextUrl.searchParams.get("adminId");
        const type = req.nextUrl.searchParams.get("type");
        const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
        const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

        const matchStage: any = {};
        if (adminId) matchStage.adminId = new mongoose.Types.ObjectId(adminId);
        if (type) matchStage.type = type;

        const pipeline = [
            { $match: matchStage },
            {
                $facet: {
                    groups: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                    ],
                    metadata: [
                        { $count: "totalGroups" }
                    ]
                }
            }

        ];

        const [result] = await Group.aggregate(pipeline);

        const groups = result.groups || [];
        const totalGroups = result.metadata[0]?.totalGroups || 0;
        const totalPages = Math.ceil(totalGroups / limit);

        return NextResponse.json(
            {
                success: true,
                groups,
                pagination: {
                    totalGroups,
                    totalPages,
                    currentPage: page,
                    limit
                }
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching groups:", error.message);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
};
