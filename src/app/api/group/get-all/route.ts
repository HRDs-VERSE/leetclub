import connectDB from "@/lib/connectDB";
import Group from "@/models/group.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        const type = req.nextUrl.searchParams.get("type");
        const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
        const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

        const matchStage: any = {};
        if (type) matchStage.type = type;
        const skip = (page - 1) * limit;

        const groupPipeline = [
            { $match: matchStage },
            { $skip: skip },
            { $limit: limit },

            {
                $lookup: {
                    from: "joinedgroups",
                    localField: "_id",
                    foreignField: "groupId",
                    as: "joinGroup"
                }
            },
            {
                $unwind: "$joinGroup"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "joinGroup.userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $project: {
                    name: 1,
                    tagLine: 1,
                    membersCount: 1,
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

        const [groups, totalGroupsResult] = await Promise.all([
            Group.aggregate(groupPipeline),
            Group.aggregate(totalGroupsPipeline),
        ]);

        const totalGroups = totalGroupsResult[0]?.totalGroups || 0;
        const totalPages = Math.ceil(totalGroups / limit);

        return NextResponse.json(
            {
                success: true,
                groups,
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
