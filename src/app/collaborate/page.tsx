'use client'

import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { FriendPerformance } from "@/components/friend-performance"
import GroupSearchResult from '@/components/GroupSearchResult'
import useJoinGroupAPI from '@/fetchAPI/useJoinGroupAPI'
import { shallowEqual, useSelector } from 'react-redux'
import useGetLeetProfile from '@/lib/useGetLeetProfile'


export default function CollaboratePage() {
  const { getJoinGroup } = useJoinGroupAPI()
  const user = useSelector((state: any) => state.user.userData, shallowEqual)

  const [newFriendName, setNewFriendName] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [hasMore, setHasMore] = useState(true)
  const [friendsProfile, setFriendsProfile] = useState<any>()
  const [group, setGroup] = useState<any>()
  const [query, setQuery] = useState("")


  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?._id) return;

      const getGroupData = {
        userId: String(user?._id),
        page,
        limit,
      };

      try {
        const data = await getJoinGroup(getGroupData);
        setGroup(data.joinedGroups[0].groupDetails)

        if (data.joinedGroups && data.joinedGroups.length > 0) {
          const profiles = await useGetLeetProfile(data.joinedGroups);
          setFriendsProfile(profiles);
        } else {
          console.error("No joined groups found");
        }
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };

    fetchFriends();
  }, [user]);


  return (
    <>
      <div className="container mx-auto p-4 space-y-6 max-w-[45rem] m-auto">
        <h1 className="text-2xl font-bold mb-6">Search Groups</h1>
        <Input
          type="text"
          placeholder="Search for groups..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-6"
        />
        {group &&
          <>
            <h1 className="text-3xl font-bold">{group[0].name}</h1>
            <h2 className="font-bold text-neutral-600">{group[0].tagLine}</h2>
          </>
        }

        {query &&
          <GroupSearchResult query={query} />
        }
        {!query &&
          <div className="grid gap-6 grid-cols-1">
            {friendsProfile?.map((friend: any, index: number) => (
              <FriendPerformance
                key={index}
                profile={friend.profile}
                user={friend.user}
              />
            ))}
          </div>
        }
      </div>
    </>
  )
}

