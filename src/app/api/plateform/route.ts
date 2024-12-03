import getLeetCodeData from "@/lib/getLeetCodeProfile";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const username = req.nextUrl.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    const response = await getLeetCodeData(username)

    return NextResponse.json(
      { success: true, data: response },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching LeetCode data:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
