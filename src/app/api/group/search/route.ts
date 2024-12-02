import connectDB from "@/lib/connectDB";
import Group from "@/models/group.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        const query = req.nextUrl.searchParams.get("query") || "";  
        const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);  
        const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10); 
        const userId = req.nextUrl.searchParams.get("userId") || "";

        if (!query) {
            return NextResponse.json(
                { success: false, message: "Query parameter is required" },
                { status: 400 }
            );
        }

        const skip = (page - 1) * limit;

        const aggregationPipeline = [
            {
              $search: {
                index: "searchGroup",  
                text: {
                  query: query,
                  path: {
                    wildcard: "*" 
                  }
                }
              }
            },
            {
              $facet: {
                groups: [
                  { $skip: skip },
                  { $limit: limit },
                  {
                    
                    $lookup: {
                      from: "joinedgroups",
                      let: { groupId: "$_id" },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [
                                { $eq: ["$groupId", "$$groupId"] },
                                { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] } 
                              ]
                            }
                          }
                        }
                      ],
                      as: "joinedGroups"
                    }
                  },
                  {
                    $addFields: {
                      isUserInGroup: { $gt: [{ $size: "$joinedGroups" }, 0] }
                    }
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                      adminId: 1,
                      membersCount: 1,
                      tagLine: 1,
                      type: 1,
                      isUserInGroup: 1
                    }
                  }
                ],
                total: [
                  { $count: "totalGroups" }
                ]
              }
            }
          ];
          
        const [result] = await Group.aggregate(aggregationPipeline);

        const groups = result.groups || [];
        const totalGroups = result.total[0]?.totalGroups || 0;
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
        console.error("Error searching groups:", error.message);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
};
