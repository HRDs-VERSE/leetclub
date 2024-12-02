"use client"
import { useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firbase";
import { Github } from 'lucide-react'
import useUserAPI from "@/fetchAPI/useUserAPI";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const { signUpWithOAuth } = useUserAPI()
    const router = useRouter()

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleSubmit = () => {
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log("Form submitted:", formData);
        // Add your signup logic here
    };

    const handleSignUpGitHub = async () => {
        const provider = new GithubAuthProvider();
        await signInWithPopup(auth, provider)
        const data = await signUpWithOAuth()
        router.push(`/profile/${data?._id}`)
    }

    return (
        <div className="min-h-screen flex items-center justify-center max-w-[20rem] m-auto">
            {/* <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                    <CardDescription className="text-gray-500">
                        Create a new account to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input
                            id="username"
                            type="text"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
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
                            placeholder="Choose a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mt-6">
                        <Button onClick={() => handleSubmit()} className="w-full">
                            Sign Up
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <p className="text-sm text-center text-gray-600">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card> */}
            <button
                className=" relative group/btn active:scale-95 transition-all duration-300 flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                onClick={handleSignUpGitHub}
            >
                <Github className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                    GitHub
                </span>
            </button>
        </div>
    );
}
