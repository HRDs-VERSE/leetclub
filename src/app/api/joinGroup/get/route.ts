import connectDB from "@/lib/connectDB";
import JoinedGroup from "@/models/joinedGroup.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        const userId = req.nextUrl.searchParams.get("userId");
        const groupId = req.nextUrl.searchParams.get("groupId");
        const type = req.nextUrl.searchParams.get("type");
        const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
        const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

        const matchStage: any = {};
        if (userId) matchStage.userId = new mongoose.Types.ObjectId(userId);
        // if (groupId) matchStage.groupId = groupId;
        if (type) matchStage.type = type;
        const skip = (page - 1) * limit;

        const joinedGroupsPipeline = [
            { $match: matchStage },
            { $skip: skip },
            { $limit: limit },
            { 
                $lookup: { 
                    from: "groups",
                    localField: "groupId",
                    foreignField: "_id",
                    as: "groupDetails"
                } 
            },
            { 
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $project: {
                    groupId: 1,
                    "groupDetails": 1,
                    "userDetails.avatar": 1,
                    "userDetails.competitivePlatforms": 1,
                    "userDetails.username": 1
                }
            }
        ];

        const totalGroupsPipeline = [
            { $match: matchStage },
            { $count: "totalGroups" }, 
        ];

        const [joinedGroups, totalGroupsResult] = await Promise.all([
            JoinedGroup.aggregate(joinedGroupsPipeline),
            JoinedGroup.aggregate(totalGroupsPipeline),
        ]);

        const totalGroups = totalGroupsResult[0]?.totalGroups || 0;
        const totalPages = Math.ceil(totalGroups / limit);

        return NextResponse.json(
            {
                success: true,
                joinedGroups,
                pagination: {
                    totalGroups,
                    totalPages,
                    currentPage: page,
                    limit,
                }
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching joined groups:", error.message);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
};
