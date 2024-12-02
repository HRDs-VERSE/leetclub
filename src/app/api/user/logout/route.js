import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async () => {
    try {
        const cookieStore = cookies();
        const allCookies = cookieStore.getAll();

        allCookies.forEach((cookie) => {
            cookieStore.delete(cookie.name, { path: "/" });
        });

        const response = NextResponse.json(
            {
                message: "Logout successful",
                success: true,
            },
            {
                headers: {
                    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                    "Surrogate-Control": "no-store",
                },
            }
        );

        return response;
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
};