import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function FriendPerformance({ profile, user }: any) {
  const totalSolved = profile.totalSolved
  const easy = profile.totalSubmissions[1].count
  const medium = profile.totalSubmissions[2].count
  const hard = profile.totalSubmissions[3].count

  const totalPoints = easy * 5 + medium * 15 + hard * 20

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{user.username}</span>
          </div>
        </CardTitle>
        <div className="text-sm font-bold">{totalPoints} pts</div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-1">
          Problems Solved: {totalSolved}
        </div>
        <Progress
          value={100}
        //   className="h-2"
          className="bg-gradient-to-r h-2 from-green-500 via-yellow-500 to-red-500"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Easy: {easy}</span>
          <span>Medium: {medium}</span>
          <span>Hard: {hard}</span>
        </div>
      </CardContent>
    </Card>
  )
}

