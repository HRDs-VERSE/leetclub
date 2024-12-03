'use client'

import { useEffect, useState } from 'react'
import { GroupPerformance } from "@/components/group-performance"
import useGroupAPI from '@/fetchAPI/useGroupAPI'
import { shallowEqual, useSelector } from 'react-redux'
import usePlatformAPI from '@/fetchAPI/usePlatformAPI'


export default function GroupCompetitionPage() {
  const { getAllGroup } = useGroupAPI()
  const { getLeetCodeGroup } = usePlatformAPI()
  const user = useSelector((state: any) => state.user.userData, shallowEqual)

  const [groups, setGroups] = useState<any>()
  const [sortedGroups, setSortedGruops] = useState<any>();

  useEffect(() => {
    const getleetGroup = async () => {
      const getGroupData = {
        type: "collaborate",
        page: 1,
        limit: 10
      }
      const data = await getAllGroup(getGroupData)
      setGroups(data.groups)
      const groupData = await getLeetCodeGroup(data.groups)
      setSortedGruops(groupData)

    }
    getleetGroup()
  }, [])


  return (
    <div className="container mx-auto p-4 space-y-6 max-w-[45rem] m-auto">
      <h1 className="text-3xl font-bold">Group Ranks</h1>

      <div className="grid gap-6 grid-cols-1">
        {!groups?.length &&
          <div className='w-full flex justify-center'>
            No Groups here
          </div>
        }
        {sortedGroups &&
          sortedGroups?.map((group: any) => (
            <GroupPerformance
              key={group._id}
              groupData={group}
              totalPoints={group.totalPoints}
              totalEasy={group.easyCount}
              totalMedium={group.mediumCount}
              totalHard={group.hardCount}
              totalQuestions={group.totalQuestions}
            />
          ))
        }
      </div>

    </div>
  )
}

