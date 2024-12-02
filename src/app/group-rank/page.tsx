'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GroupPerformance } from "@/components/group-performance"
import useGroupAPI from '@/fetchAPI/useGroupAPI'
import useJoinGroupAPI from '@/fetchAPI/useJoinGroupAPI'
import { shallowEqual, useSelector } from 'react-redux'
import fetchLeetCodePoints from '@/lib/calculateLeetCodePoin'


export default function GroupCompetitionPage() {
  const { getAllGroup } = useGroupAPI()
  const user = useSelector((state: any) => state.user.userData, shallowEqual)

  const [groups, setGroups] = useState<any>()
  const [sortedGroups, setSortedeGroups] = useState<any>()


  useEffect(() => {
    const getleetGroup = async () => {
      const getGroupData = {
        type: "collaborate",
        page: 1,
        limit: 10
      }
      const data = await getAllGroup(getGroupData)
      setGroups(data.groups)
    }
    getleetGroup()
  }, [])


  useEffect(() => {
    if (!groups) return
    const getPerformance = async () => {
      const result = await fetchLeetCodePoints(groups)
      setSortedeGroups(result)

    }
    getPerformance()
  }, [groups])


  return (
    <div className="container mx-auto p-4 space-y-6 max-w-[45rem] m-auto">
      <h1 className="text-3xl font-bold">Group Ranks</h1>

      <div className="grid gap-6 grid-cols-1">
      {!groups?.length &&
          <div className='w-full flex justify-center'>
            No Groups here
          </div>
        }
        {sortedGroups?.map((group: any) => (
          <GroupPerformance
            key={group._id}
            groupData={group}
            totalPoints={group.totalPoints}
            totalEasy={group.easyCount}
            totalMedium={group.mediumCount}
            totalHard={group.hardCount}
            totalQuestions={group.totalQuestions}
          />
        ))}
      </div>

    </div>
  )
}

