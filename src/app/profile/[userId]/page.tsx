"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import { DifficultyBreakdown } from "@/components/difficulty-breakdown"
import { shallowEqual, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import useUserAPI from "@/fetchAPI/useUserAPI"
import usePlatformAPI from "@/fetchAPI/usePlatformAPI"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useGroupAPI from "@/fetchAPI/useGroupAPI"
import GitHubHeatmap from "@/components/GitHubHeatmap"
import GitHubCommits from "@/components/GitHubCommits"
import LeetCodeQuestions from "@/components/LeetCodeQuestions"

interface Platform {
  name: string
  rank: number
  easy: number
  medium: number
  hard: number
}

type TechStack = {
  name: string;
};

type CompetitivePlatform = {
  platformName: string;
  username: string
}


type UserType = {
  _id: string
  avatar: string
  username: string;
  email: string;
  about?: string;
  isVerified: boolean;
  verifyToken?: number;
  techStack: TechStack[];
  competitivePlatforms: CompetitivePlatform[];
  verifyCode: string;
  verifyCodeExpiry: Date;
  isOAuth?: boolean;
  newUserInfoDone: boolean;
};


type FormValues = {
  name: string;
  tagLine: string;
  type: 'collaborate' | 'university' | 'group';
};


export default function ProfilePage() {
  const router = useRouter()
  const { userId } = useParams();
  const { getLeetCodeProfile, getGitHubHeatMap, newLeetCodeAPI, getLeetCodeHeatmap } = usePlatformAPI()
  const { createGroup } = useGroupAPI()
  const stringUserId = userId as string
  const { getUser, toggelUser } = useUserAPI()
  const user = useSelector((state: any) => state.user.userData, shallowEqual)

  const [userData, setUserData] = useState<UserType>()
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)
  const [leetCodeProfile, setLeetCodeProfile] = useState<any>()
  const [openAlert, setOpenAlert] = useState(false)
  const [openCreateGroup, setOpenCreateGroup] = useState(false)
  const [gitHubContribution, setGitHubContribution] = useState()
  const [leetCodeContribution, setLeetCodeContribution] = useState<any>()
  const [gitTotalContribution, setGitTotalContribution] = useState<number>()
  const [groupForm, setGroupForm] = useState<FormValues>({
    name: "",
    tagLine: "",
    type: "" as 'collaborate' | 'university' | 'group',
  });


  const handleTypeChange = (value: 'collaborate' | 'university' | 'group') => {
    setGroupForm((prevFormData) => ({
      ...prevFormData,
      type: value,
    }));
  };


  useEffect(() => {
    if (userData?.newUserInfoDone === false) {
      console.log("user not done")
      setOpenAlert(true)
    }
  }, [userData])

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGroupForm((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUser(stringUserId);
      setUserData(user);
      setLoading(false)
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleCreateGroup = async () => {
    const groupData = {
      ...groupForm,
      adminId: String(userData?._id),
    };

    try {
      await createGroup(groupData)
    } catch (error) {
      console.error('Error creating group:', error)
    }
  }

  useEffect(() => {
    const getPlatformProfile = async () => {
      if (userData?.competitivePlatforms[0].platformName === "LeetCode") {
        const data = await newLeetCodeAPI(userData?.competitivePlatforms[0].username)
        setLeetCodeProfile(data.matchedUser.submitStatsGlobal.acSubmissionNum)

        const profile = await getLeetCodeHeatmap(userData?.competitivePlatforms[0].username)
        const { submissionCalendar, ...otherData } = profile;

        const formate = formateData(submissionCalendar)
        const filledCalendar = makeAllDates()

        const mergeBothDate = filledCalendar.filter(item =>
          !formate.some(item2 => item2.date === item.date)
        );

        mergeBothDate.push(...formate);

        mergeBothDate.sort((a, b) => {
          const dateA: any = new Date(a.date.split("-").reverse().join("-"));
          const dateB: any = new Date(b.date.split("-").reverse().join("-"));
          return dateA - dateB;
        });

        setLeetCodeContribution({
          ...otherData,
          formate: mergeBothDate
        })

        setProfileLoading(false)
      }
    }

    if (userData?._id) {
      getPlatformProfile()
      handleGetGitHubContribution()
    }

  }, [userData])

  const date = new Date();

  const makeAllDates = () => {
    const year = date.getFullYear();
    const filledCalendar = [];
    const firstDate = new Date(`${year}-01-01`);

    for (let d = new Date(firstDate); d.getFullYear() === year; d.setDate(d.getDate() + 1)) {
      const formattedDate = `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
      const data = {
        date: formattedDate,
        count: 0
      }
      filledCalendar.push(data);
    }

    return filledCalendar;

  }


  const formateData = (submissionCalendar: any) => {
    const calendar = JSON.parse(submissionCalendar);

    const formattedData = Object.entries(calendar).map(([timestamp, count]: any) => {
      const date = new Date(timestamp * 1000);
      const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");

      return { date: formattedDate, count };
    });

    return formattedData;

  }

  const handleGetGitHubContribution = async () => {
    const data = await getGitHubHeatMap(String(userData?.username))

    const flattenedContributions: any = data?.contributionCalendar.weeks.flatMap((week: any) =>
      week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount
      }))
    );

    setGitTotalContribution(data?.contributionCalendar.totalContributions)
    setGitHubContribution(flattenedContributions)
  }

  const handleToggelUser = async () => {
    try {
      await toggelUser(stringUserId)
    } catch (error) {
      console.error('Error toggling user:', error)
    }
  }


  return (
    <>
      <div className="container mx-auto p-4 space-y-6 max-w-[45rem] m-auto">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={userData?.avatar} alt={userData?.username} />
            <AvatarFallback>{userData?.username}</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold">{userData?.username}</h1>
        </div>
        <div className="flex flex-col gap-2">
          <h1>GitHub Contributions</h1>
          <h2 className="text-[.9rem] text-neutral-300">{gitTotalContribution} contributions in the last year</h2>
          <GitHubHeatmap contribution={gitHubContribution} />
          <GitHubCommits username={userData?.username}/>
        </div>
        <div className="flex flex-col gap-2">
          <h1>LeetCode Contributions</h1>
          <h2 className="text-[.9rem] text-neutral-300">{leetCodeContribution?.streak} Streak</h2>
          <h2 className="text-[.9rem] text-neutral-300">{leetCodeContribution?.totalActiveDays} Total ActiveDays</h2>
          <GitHubHeatmap contribution={leetCodeContribution?.formate} />
          <LeetCodeQuestions username={String(userData?.competitivePlatforms[0].username)}/>
        </div>
        <Button onClick={() => setOpenCreateGroup(prev => !prev)}>Create Group</Button>
        <div className="grid gap-6 grid-cols-1">
          {leetCodeProfile &&
            <Card >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>LeetCode</span>
                  <span className="text-sm font-normal">Rank: {leetCodeProfile.ranking}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground mb-1">
                  Problems Solved: {leetCodeProfile[0].count}
                </div>
                <DifficultyBreakdown
                  easy={leetCodeProfile[1].count}
                  medium={leetCodeProfile[2].count}
                  hard={leetCodeProfile[3].count}
                />
              </CardContent>
            </Card>
          }
          {(!leetCodeProfile && !profileLoading && !loading) &&
            <Button onClick={() => router.push("/profile/update")}>Add Competitive Profile Username</Button>
          }
        </div>
      </div>
      <Dialog open={openCreateGroup} onOpenChange={setOpenCreateGroup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Group</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new group.
            </DialogDescription>
          </DialogHeader>
          <h1>GitHub Contributions</h1>
          <div className="space-y-4">
            {/* Group Name Input */}
            <div>
              <Label htmlFor="groupName" className="block text-sm font-medium ">
                Group Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                onChange={handleChanges}
                required
                className="mt-1 block w-full rounded-md sm:text-sm"
                placeholder="Enter group name"
              />
            </div>
            {/* Group Description Input */}
            <div>
              <Label htmlFor="description" className="block text-sm font-medium ">
                Tag Line
              </Label>
              <Input
                id="tagLine"
                name="tagLine"
                onChange={handleChanges}
                required
                className="mt-1 block w-full rounded-md shadow-sm sm:text-sm"
                placeholder="Enter Group Tag Line"
              />
            </div>
            {/* Group Type Select */}
            <div>
              <Label htmlFor="type" className="block text-sm font-medium ">
                Group Type
              </Label>
              <Select onValueChange={(value: 'collaborate' | 'university' | 'group') => handleTypeChange(value)}>
                <SelectTrigger className="rounded">
                  <SelectValue placeholder={"Select Group Type"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"collaborate"}>Collaborate</SelectItem>
                  <SelectItem value={"group"}>Group</SelectItem>
                  <SelectItem value={"university"}>University</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => setOpenCreateGroup(false)}
              className="mr-3 inline-flex justify-center rounded-md border text-black border-gray-300 bg-white px-4 py-2 text-sm font-medium  shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            {/* Submit Button */}
            <button
              onClick={() => handleCreateGroup()}
              className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-black shadow-sm focus:ring-offset-2"
            >
              Create Group
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Go through</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col gap-4 text-white">
                <h1 className="text-2xl font-bold">Welcome &apos; {user?.username}!</h1>
                <p className="text-sm text-gray-300">
                  Explore the three types of groups you can create and join:
                </p>
                <div className="mt-2">
                  <div className="mb-2">
                    <h2 className="text-lg font-semibold text-white">Collaborate</h2>
                    <p className="text-sm text-gray-300">
                      Work with friends to enhance each other&lsquo;s performance.
                    </p>
                  </div>
                  <div className="mb-2">
                    <h2 className="text-lg font-semibold text-white">Group</h2>
                    <p className="text-sm text-gray-300">
                      Track and compare your ranks in group leaderboards.
                    </p>
                  </div>
                  <div className="mb-2">
                    <h2 className="text-lg font-semibold text-white">University</h2>
                    <p className="text-sm text-gray-300">
                      See how you rank in your university&lsquo;s leaderboard.
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  Note: You can only join one of each type of group and create
                </p>
                <p className="text-sm text-gray-400 italic mt-2">
                  &quot;Understand! you better understand&quot;
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => handleToggelUser()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </>
  )
}

