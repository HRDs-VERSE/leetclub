import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import useJoinGroupAPI from "@/fetchAPI/useJoinGroupAPI"
import { Users } from 'lucide-react'
import { shallowEqual, useSelector } from "react-redux"

interface GroupSearchResultCardProps {
  name: string
  membersCount: number
  groupId: string
  type: string
  tagLine: string
  isUserInGroup: boolean
}

export function GroupSearchResultCard({ groupId, type, name, membersCount, tagLine, isUserInGroup }: GroupSearchResultCardProps) {
  const { joinGroup, leaveGroup } = useJoinGroupAPI()
  const user = useSelector((state: any) => state.user.userData, shallowEqual)

  const handleJoin = async () => {
    const joinGroupData = {
      groupId: String(groupId),
      userId: String(user._id),
      type: type as 'collaborate' | 'university' | 'group' | "leetGroup" | "leetUniversity"
    }

    try {
      await joinGroup(joinGroupData)
    } catch (error) {
      console.error('Error joining group:', error)
    }
  }

  const handleLeave = async () => {
    const leaveGroupData = {
      groupId: String(groupId),
      userId: String(user._id),
    }
    try {
      await leaveGroup(leaveGroupData)
    } catch (error) {
      console.error('Error leaving group:', error)
    }
      
  }


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <span className="truncate">{name}</span>
            <p className="text-sm text-muted-foreground">
              {membersCount} {membersCount === 1 ? 'member' : 'members'}
            </p>
          </div>
          <Users className="w-5 h-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {tagLine}
        </p>
      </CardContent>
      <CardFooter>
        {isUserInGroup ? (
          <Button onClick={handleLeave} className="w-full ">Leave Group</Button>
        ) : (
          <Button onClick={handleJoin} className="w-full ">Join Group</Button>
        )}
      </CardFooter>
    </Card>
  )
}

