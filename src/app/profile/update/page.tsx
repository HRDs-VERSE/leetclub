'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useUserAPI from '@/fetchAPI/useUserAPI'
import { shallowEqual, useSelector } from 'react-redux'
import usePlatformAPI from '@/fetchAPI/usePlatformAPI'

interface PlatformData {
  platformName: string
  username: string
}

const initialPlatforms: PlatformData[] = [
  { platformName: 'LeetCode', username: '' },
  { platformName: 'GitHub', username: '' },
  { platformName: 'HackerRank', username: '' },
  { platformName: 'CodeForces', username: '' },
]

const UpdateProfile = () => {
  const { updateUser, updateSession } = useUserAPI()
  const user = useSelector((state: any) => state.user.userData, shallowEqual)

  const [platforms, setPlatforms] = useState<PlatformData[]>(initialPlatforms)

  const handleUsernameChange = (index: number, username: string) => {
    setPlatforms((prevPlatforms) => {
      const updatedPlatforms = [...prevPlatforms];
      updatedPlatforms[index].username = username;
      return updatedPlatforms;
    });
  };


  useEffect(() => {
    if (user?._id && user.competitivePlatforms?.length) {
      setPlatforms(user.competitivePlatforms.map((platform: PlatformData) => ({
        platformName: platform.platformName,
        username: platform.username || ''
      })));
    }
  }, [user]);

  const handleSubmit = () => {
    updateUser(platforms, user?._id)
    updateSession()
  }

  return (
    <div className="container mx-auto p-4 max-w-[45rem] m-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Your Competitive Programming Profiles</h1>
      <Card className=" w-[24rem] sm:w-[30rem] mx-auto bg-black">
        <CardHeader>
          <CardTitle>Update Competitive Platform Profiles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {platforms.map((platform, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`username-${index}`}>{platform.platformName} Username</Label>
              <Input
                id={`username-${index}`}
                value={platform.username}
                disabled={platform.platformName !== 'LeetCode' && platform.platformName !== "GitHub"}
                onChange={(e) => handleUsernameChange(index, e.target.value)}
                placeholder={`Enter your ${platform.platformName} username`}
              />
            </div>
          ))}

        </CardContent>
        <CardFooter>
          <Button onClick={() => handleSubmit()} className="w-full ">Update Profiles</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default UpdateProfile