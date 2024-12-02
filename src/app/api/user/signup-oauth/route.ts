import User from "@/models/user.model";
import { deleteUser } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/connectDB";


export const POST = async(req: NextRequest) => {
    connectDB()

    try {

        const { user, screenName }= await req.json()
        
        const isUserExistWithUID = await User.findOne({ oAuthUID: user.uid })

        if(isUserExistWithUID){
            return NextResponse.json(
                {message: "User already exist"},
                {status: 400})
        }

        const isUserExistWithEmail = await User.findOne({ email: user.email })

        if(isUserExistWithEmail){
            return NextResponse.json(
                {message: "User already exist"},
                {status: 400})
        }

        const hashedPassword = await bcrypt.hash(user.uid, 10)

        const newUser = await User.create({
            avatar: user.photoURL,
            username: screenName,
            email: user.email,
            password: hashedPassword,
            isVerified: true,
            isOAuth: true,
            oAuthUID: user.uid
        })

        if (!newUser) {
            await deleteUser(user)
            return NextResponse.json(
                {message: "Try again, something went wrong"},
                {status: 500})
        }

        const { password, verifyCode, verifyCodeExpiry, oAuthUID, ...newUserWithoutPassword } = newUser.toObject();

        const response = NextResponse.json(
            { message: "SignUp successfull", newUser: newUserWithoutPassword },
            { status: 201 }
        );

        const tokenValue = {
            _id: newUser._id,
            username: newUser.username,
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
