'use client'

import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { FriendPerformance } from "@/components/friend-performance"
import GroupSearchResult from '@/components/GroupSearchResult'
import useJoinGroupAPI from '@/fetchAPI/useJoinGroupAPI'
import { shallowEqual, useSelector } from 'react-redux'
import usePlatformAPI from '@/fetchAPI/usePlatformAPI'
import GroupPerformanceSkeleton from '@/components/Skeleton/GroupPerformanceSkeleton '


export default function CollaboratePage() {
  const { getJoinGroup } = useJoinGroupAPI()
  const { getCollaborateProfile } = usePlatformAPI()
  const user = useSelector((state: any) => state.user.userData, shallowEqual)

  const [newFriendName, setNewFriendName] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [hasMore, setHasMore] = useState(true)
  const [group, setGroup] = useState<any>()
  // const [joinedGroups, setJoinedGroups] = useState<any>()
  const [leetCodeProfiles, setLeetCodeProfiles] = useState<any>()


  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?._id) return;

      const getGroupData = {
        userId: String(user?._id),
        page,
        limit,
        type: "collaborate" as 'collaborate' | 'university' | 'group' | "leetGroup" | "leetUniversity"
      };

      try {
        const data = await getJoinGroup(getGroupData);
        setGroup(data.joinedGroups[0].groupDetails)

        if (data.joinedGroups && data.joinedGroups.length > 0) {
          // setJoinedGroups(data.joinedGroups[0].userDetails)
          const profileData = await getCollaborateProfile(data.joinedGroups[0].userDetails)
          setLeetCodeProfiles(profileData)

        } else {
          console.error("No joined groups found");
        }
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };

    fetchFriends();
  }, [user?._id]);


  return (
    <>
      {!group && <GroupPerformanceSkeleton />}
      {group &&
        <div className="container mx-auto p-4 space-y-6 max-w-[45rem] m-auto">
          {group &&
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{group[0].name}</h1>
              <h2 className="font-bold text-neutral-600">{group[0].tagLine}</h2>
            </div>
          }
          <div className="grid gap-6 grid-cols-1">
            {leetCodeProfiles?.map((friend: any, index: number) => (
              <FriendPerformance
                key={index}
                profile={friend.profile}
                user={friend.user}
              />
            ))}
          </div>
        </div>
      }
    </>
  )
}

