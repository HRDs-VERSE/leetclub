import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/connectDB";


export const POST = async (req: NextRequest) => {
    connectDB()

    try {

        const { uid } = await req.json()

        const user = await User.findOne({ oAuthUID: uid }).select('-password -updatedAt -createdAt -verifyCode -verifyCodeExpiry -oAuthUID')

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 400 })
        }


        const response = NextResponse.json(
            { message: "Login successfull", user },
            { status: 200 }
        );

        const tokenValue = {
            _id: user._id,
            username: user.username,
        };

        const accessToken = jwt.sign(
            tokenValue,
            process.env.TOKEN_SECRET as string,
            { expiresIn: "15m" } 
          );
    
          const refreshToken = jwt.sign(
            tokenValue,
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "30d" } 
          );
   
          response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 15 * 60,
          });
    
          response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60,
          });
    
          return response;        

    } catch (error) {

        console.error("Error signing in with GitHub:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }


}
