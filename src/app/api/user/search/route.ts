import connectDB from "@/lib/connectDB";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        const query = req.nextUrl.searchParams.get("query") || "";
        const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
        const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

        if (!query) {
            return NextResponse.json(
                { success: false, message: "Query parameter is required" },
                { status: 400 }
            );
        }

        const skip = (page - 1) * limit;

        const totalUsers = await User.aggregate([
            { $search: { index: "searchUser", text: { query, path: { wildcard: "*" } } } },
            { $count: "total" }
        ]);

        const users = await User.aggregate([
            {
                $search: {
                    index: "userSearch",
                    text: {
                        query: query,
                        path: {
                            wildcard: "*"
                        }
                    }
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    avatar: 1,
                    username: 1
                }
            }
        ]);

        const total = totalUsers[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json(
            {
                success: true,
                message: "User fetched successfully",
                data: users,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    limit,
                },
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error searching groups:", error.message);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
};
