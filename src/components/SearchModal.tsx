"use client"
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from './ui/scroll-area'
import UserSearchCard from './UserSearchCard'
import useGroupAPI from '@/fetchAPI/useGroupAPI'
import { shallowEqual, useSelector } from 'react-redux'
import { useDebounce } from 'use-debounce'
import { GroupSearchResultCard } from './GroupSearchResultCard'
import useUserAPI from '@/fetchAPI/useUserAPI'
import InfiniteScroll from 'react-infinite-scroll-component';
import { CardSkeleton } from './Skeleton/CardSkeleton'
import { UserSearchCardSkeleton } from './Skeleton/UserSearchCard'

const SearchModal = ({ open, setOpen }: any) => {
    const { searchGroup } = useGroupAPI()
    const { searchUser } = useUserAPI()
    const user = useSelector((state: any) => state.user.userData, shallowEqual)

    const [activeTab, setActiveTab] = useState("group");
    const [groups, setGroups] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [groupHasMore, setGroupHasMore] = useState(true)
    const [userHasMore, setUserHasMore] = useState(true)
    const [query, setQuery] = useState("")
    const [searchQuery] = useDebounce(query, 200);

    const fetchGroups = async () => {
        const data = await searchGroup(searchQuery, page, limit, String(user?._id))
        const group = data.groups

        if (group.length < limit) {
            setGroupHasMore(false)
        }
        setGroups((prevState) => {
            const newGroups = group.filter((newGroup: any) =>
                !prevState.some((existingGroup) => existingGroup._id === newGroup._id)
            )
            return [...prevState, ...newGroups]
        })

    }

    const fetchUsers = async () => {
        const data = await searchUser(searchQuery, page, limit)
        const users = data.data

        if (users.length < limit) {
            setUserHasMore(false)
        }
        setUsers((prevState) => {
            const newUsers = users.filter((newUser: any) =>
                !prevState.some((existingUser) => existingUser._id === newUser._id)
            )
            return [...prevState, ...newUsers]
        })
    }

    useEffect(() => {
        if (searchQuery) {
            if (activeTab === "group") {
                fetchGroups()
            } else {
                fetchUsers()
            }
        }
    }, [searchQuery])

    useEffect(() => {
        if (activeTab === "group") {
            setGroups([])
            setQuery("")
            setGroupHasMore(true)
            setPage(1)
        } else {
            setUsers([])
            setQuery("")
            setUserHasMore(true)
            setPage(1)
        }
    }, [activeTab])

    useEffect(() => {
        setQuery("")
        setGroups([])
        setUsers([])
    }, [open])

    const groupFetchMoreData = () => {
        if (!groupHasMore) return;
        setPage((prevPage) => prevPage + 1);
    }
    const userFetchMoreData = () => {
        if (!userHasMore) return;
        setPage((prevPage) => prevPage + 1);
    }



    return (
        <>
        
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Search</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 relative h-[34rem] ">
                        <div className='w-full'>
                            <input
                                placeholder="Search for User or Group"
                                className={`p-2 rounded-l-[10px] text-white outline-none bg-neutral-900 border-y-[1px]border-neutral-600 text-[.8rem] w-full`}
                                onChange={(e) => setQuery(e.target.value)}
                                value={query}
                            />
                        </div>
                        <div className='flex gap-4 items-center top-[6rem] bg-black rounded-[10px] w-full py-1'>
                            <div className='flex justify-evenly w-full'>
                                <div
                                    onClick={() => setActiveTab("group")}
                                    className={`cursor-pointer px-4 py-2 rounded-[8px] text-[.8rem] w-[48%] text-center ${activeTab === "group"
                                        ? 'bg-white text-black'
                                        : 'text-neutral-500 bg-neutral-900'
                                        }`}
                                >
                                    Group
                                </div>
                                <div
                                    onClick={() => setActiveTab("user")}
                                    className={`cursor-pointer px-4 py-2 rounded-[8px] text-[.8rem] w-[48%] text-center ${activeTab === "user"
                                        ? 'bg-white text-black'
                                        : 'text-neutral-500 bg-neutral-900'
                                        }`}
                                >
                                    User
                                </div>
                            </div>
                        </div>
                        <div className='w-full'>

                            <ScrollArea className="h-[28rem] w-full rounded-md">
                                {activeTab == "group" &&
                                    <InfiniteScroll
                                        dataLength={groups.length}
                                        next={groupFetchMoreData}
                                        className='p-4 flex flex-col gap-2'
                                        hasMore={groupHasMore}
                                        loader={
                                            <>
                                                <CardSkeleton />
                                                <CardSkeleton />
                                                <CardSkeleton />
                                            </>
                                        }
                                    >
                                        {groups.map(group => (
                                            <GroupSearchResultCard
                                                key={group._id}
                                                name={group.name}
                                                tagLine={group.tagLine}
                                                groupId={group._id}
                                                type={group.type}
                                                isUserInGroup={group.isUserInGroup}
                                                membersCount={group.membersCount}
                                            />
                                        ))}
                                    </InfiniteScroll>

                                }
                                {activeTab == "user" &&
                                    <InfiniteScroll
                                        dataLength={users?.length}
                                        next={userFetchMoreData}
                                        className='p-4 flex flex-col gap-2'
                                        hasMore={userHasMore}
                                        loader={
                                            <>
                                                <UserSearchCardSkeleton/>
                                                <UserSearchCardSkeleton/>
                                                <UserSearchCardSkeleton/>
                                                <UserSearchCardSkeleton/>
                                            </>
                                        }
                                    >
                                        {users.map(user => (
                                            <UserSearchCard
                                                key={user._id}
                                                setOpen={setOpen}
                                                username={user.username}
                                                avatar={user.avatar}
                                                _id={user._id}
                                            />
                                        ))}
                                    </InfiniteScroll>

                                }
                            </ScrollArea>


                        </div>
                    </div>

                </DialogContent>
            </Dialog>

        </>
    )
}


export default SearchModal

