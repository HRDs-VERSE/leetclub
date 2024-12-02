import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"


export function GroupPerformance({ groupData, totalPoints, totalEasy, totalHard, totalMedium, totalQuestions  }: any) {
  
  const averagePoints = Math.round(totalPoints / groupData.membersCount)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{groupData.name}</CardTitle>
        <div className="text-sm font-bold">{totalPoints} pts</div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Avg: {averagePoints} pts</span>
          <span>Members: {groupData.membersCount}</span>
        </div>
        <Progress
          value={100}
        //   className="h-2"
          className="bg-gradient-to-r h-2 from-green-500 via-yellow-500 to-red-500"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Easy: {totalEasy}</span>
          <span>Medium: {totalMedium}</span>
          <span>Hard: {totalHard}</span>
        </div>
      </CardContent>
    </Card>
  )
}

