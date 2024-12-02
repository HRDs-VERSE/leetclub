'use client'

import { useEffect, useState } from 'react'
import { GroupSearchResultCard } from './GroupSearchResultCard'
import useGroupAPI from '@/fetchAPI/useGroupAPI'
import { useDebounce } from 'use-debounce';
import { shallowEqual, useSelector } from 'react-redux';

const sampleGroups = [
  { id: 1, name: "Algorithm Enthusiasts", memberCount: 150 },
  { id: 2, name: "Competitive Coders United", memberCount: 75 },
  { id: 3, name: "LeetCode Masters", memberCount: 200 },
  { id: 4, name: "Data Structure Wizards", memberCount: 100 },
]

type prop = {
  query: string
}

function GroupSearchResult({ query }: prop) {

  const { searchGroup } = useGroupAPI()
  const user = useSelector((state: any) => state.user.userData, shallowEqual)
  const [searchQuery] = useDebounce(query, 200);

  const [groups, setGroups] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [hasMore, setMore] = useState(true)

  useEffect(() => {
    const fetchGroups = async () => {
      const data = await searchGroup(searchQuery, page, limit, String(user?._id))
      const group = data.groups
      if (group.length < limit) {
        setMore(false)
      }
      setGroups((prevState) => {
        const newGroups = group.filter((newGroup: any) => 
          !prevState.some((existingGroup) => existingGroup._id === newGroup._id)
        )
        return [...prevState, ...newGroups]
      })

    }

    if (searchQuery) {
      fetchGroups()
    }

  }, [searchQuery])

  return (
    <div className="container p-4 max-w-[45rem] m-auto">
      <div className="grid grid-cols-1 gap-6 w-full">
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
      </div>
    </div>
  )
}

export default GroupSearchResult

