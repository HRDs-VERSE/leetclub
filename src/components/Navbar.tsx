'use client'

import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { shallowEqual, useSelector } from "react-redux"
import useUserAPI from "@/fetchAPI/useUserAPI"
import LogoutDialog from "./LogoutDiaload"

const routes = [
    { href: "/collaborate", label: "Collaborate" },
    { href: "/group-rank", label: "Group Rank" },
    { href: "/college-rank", label: "College Rank" },
]

const Navbar = () => {
    const { userId } = useParams();
    const pathname = usePathname()
    const { updateSession, getUser } = useUserAPI()
    const router = useRouter()
    const user = useSelector((state: any) => state.user.userData, shallowEqual)

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [openLogout, setOpenLogout] = useState(false)

    console.log(user)

    useEffect(() => {
        if (user?._id) {
            setIsAuthenticated(true)
        } else {
            setIsAuthenticated(false)
        }
    }, [user])

    useEffect(() => {
        updateSession()
    }, [])

    return (
        <>
            <nav className="bg-black shadow-sm rounded-[8px] max-w-[45rem] m-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link href="/" className="flex-shrink-0 flex items-center">
                                <span className="text-[1.5rem] font-semibold text-primary">LeetClub</span>
                            </Link>
                        </div>
                        <div className="flex items-center">
                            {isAuthenticated ? (
                                <>
                                    <div className="ml-6 flex sm:space-x-8">
                                        {routes.map((route) => (
                                            <Link
                                                key={route.href}
                                                href={route.href}
                                                className={`hidden sm:inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === route.href
                                                    ? "border-primary text-primary"
                                                    : "border-transparent text-neutral-500 hover:border-gray-300 hover:text-neutral-300"
                                                    }`}
                                            >
                                                {route.label}
                                            </Link>
                                        ))}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Avatar>
                                                    <AvatarImage src={user?.avatar} alt={user?.username} />
                                                    <AvatarFallback>{user?.username}</AvatarFallback>
                                                </Avatar>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className={"bg-black border-[1px] w-[10rem] font-medium border-neutral-800 text-white"}>
                                                <DropdownMenuItem onClick={() => router.push(`/profile/${user?._id}`)}>Profile</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/profile/update`)}>Update</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="flex sm:hidden" onClick={() => router.push("/collaborate")}>Collaborate</DropdownMenuItem>
                                                <DropdownMenuItem className="flex sm:hidden" onClick={() => router.push("/group-rank")}>Group Competition</DropdownMenuItem>
                                                <DropdownMenuItem className="flex sm:hidden" onClick={() => router.push("/college-rank")}>College Competition</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setOpenLogout(true)}>Logout</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                    </div>
                                </>
                            ) : (
                                <div className="flex gap-2">
                                    <Button className="" onClick={() => router.push("/auth/signup")}>Signup</Button>
                                    <Button className="" onClick={() => router.push("/auth/login")}>Login</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-blue-700 to-transparent h-[1px] w-full" />
            </nav>
            <LogoutDialog open={openLogout} setOpen={setOpenLogout} />
        </>

    )
}

export default Navbar