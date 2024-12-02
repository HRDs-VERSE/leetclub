"use client"
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firbase";
import { Github } from 'lucide-react'
import useUserAPI from "@/fetchAPI/useUserAPI";
import { useRouter } from "next/navigation";


export default function LoginPage() {
    const { loginWithOAuth } = useUserAPI()
    const router = useRouter()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = () => {
        console.log("Login form submitted:", formData);
        // Add login logic here
    };

    const handleSignInGitHub = async () => {
        const provider = new GithubAuthProvider();
        await signInWithPopup(auth, provider)
        const data = await loginWithOAuth()
        router.push(`/profile/${data?._id}`)
    }


    return (
        <div className="min-h-screen flex items-center justify-center max-w-[20rem] m-auto ">
            {/* <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription className="text-gray-500">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-6">
                            <Button onClick={() => handleSubmit()} className="w-full">
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <p className="text-sm text-center text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup" className="text-blue-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card> */}
            <button
                className=" relative group/btn active:scale-95 transition-all duration-300 flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                onClick={handleSignInGitHub}
            >
                <Github className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                    GitHub
                </span>
            </button>
        </div>
    );
}
