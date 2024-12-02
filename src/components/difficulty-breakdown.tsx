import { Progress } from "@/components/ui/progress"

interface DifficultyBreakdownProps {
  easy: number
  medium: number
  hard: number
}

export function DifficultyBreakdown({ easy, medium, hard }: DifficultyBreakdownProps) {
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Easy: {easy}</span>
        <span>Medium: {medium}</span>
        <span>Hard: {hard}</span>
      </div>
      <Progress
        value={100}
        // className="h-2"
        className="bg-gradient-to-r h-2 from-green-500 via-yellow-500 to-red-500"
      />
      <div className="flex text-xs text-muted-foreground">
        <div className="w-[33%]">Easy</div>
        <div className="w-[34%] text-center">Medium</div>
        <div className="w-[33%] text-right">Hard</div>
      </div>
    </div>
  )
}

