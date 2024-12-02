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
  const { getLeetCodeProfile } = usePlatformAPI()
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
    if (userData?.newUserInfoDone === false){
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
        const data = await getLeetCodeProfile(userData?.competitivePlatforms[0].username)
        setLeetCodeProfile(data)
        setProfileLoading(false)
      }
    }

    if (userData?._id) {
      getPlatformProfile()
    }

  }, [userData])

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
                  Problems Solved: {leetCodeProfile.totalSubmissions[0].count}
                </div>
                <DifficultyBreakdown
                  easy={leetCodeProfile.totalSubmissions[1].count}
                  medium={leetCodeProfile.totalSubmissions[2].count}
                  hard={leetCodeProfile.totalSubmissions[3].count}
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
                <h1 className="text-2xl font-bold">Welcome, {user?.username}!</h1>
                <p className="text-sm text-gray-300">
                  Explore the three types of groups you can create and join:
                </p>
                <div className="mt-2">
                  <div className="mb-2">
                    <h2 className="text-lg font-semibold text-white">Collaborate</h2>
                    <p className="text-sm text-gray-300">
                      Work with friends to enhance each other's performance.
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
                      See how you rank in your university's leaderboard.
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  Note: You can only join one of each type of group and create
                </p>
                <p className="text-sm text-gray-400 italic mt-2">
                  "Understand! you better understand"
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

