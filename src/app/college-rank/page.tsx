'use client'

import { useEffect, useState } from 'react'
import { GroupPerformance } from "@/components/group-performance"
import { shallowEqual, useSelector } from 'react-redux'
import useGroupAPI from '@/fetchAPI/useGroupAPI'
import useFetchLeetCodePoints from '@/lib/useCalculateLeetCodePoin'



export default function CollegeCompetitionPage() {
  const [colleges, setColleges] = useState<any>()

  const { getAllGroup } = useGroupAPI()
  const user = useSelector((state: any) => state.user.userData, shallowEqual)

  const [sortedColleges, setSortedColleges] = useState<any>()


  useEffect(() => {
    const getleetGroup = async () => {
      const getGroupData = {
        type: "university",
        page: 1,
        limit: 10
      }
      const data = await getAllGroup(getGroupData)
      setColleges(data.groups)
    }
    getleetGroup()
  }, [])


  useEffect(() => {
    if (!colleges) return
    const getPerformance = async () => {
      const result = await useFetchLeetCodePoints(colleges)

      setSortedColleges(result)

    }
    getPerformance()
  }, [colleges])

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-[45rem] m-auto">
      <h1 className="text-3xl font-bold">College Rank</h1>

      <div className="grid gap-6 grid-cols-1">
        {!colleges?.length &&
          <div className='w-full flex justify-center'>
            No University here
          </div>
        }
        {sortedColleges?.map((college: any) => (
          <GroupPerformance
            key={college._id}
            groupData={college}
            totalPoints={college.totalPoints}
            totalEasy={college.easyCount}
            totalMedium={college.mediumCount}
            totalHard={college.hardCount}
            totalQuestions={college.totalQuestions}
          />
        ))}
      </div>
    </div>
  )
}

