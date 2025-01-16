import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const UserSearchCard = ({ _id, username, avatar, setOpen }: any) => {
  const router = useRouter()
  return (
    <>
      <div
        onClick={() => {
          router.push(`/profile/${_id}`)
          setOpen(false)
        }}
        className="flex gap-3 hover:bg-neutral-800 p-1 rounded-[8px]">
        <Image
          src={avatar}
          alt="Profile Picture"
          width={100}
          height={100}
          className="w-[3rem] h-[3rem] object-cover rounded-full bg-white"
        />
        <div className="flex flex-col gap-1 justify-center">
          <span className="font-medium text-white">{username}</span>
          {/* <span className="text-neutral-500 text-[.9rem]">something@gmail.com</span> */}
        </div>
      </div>
    </>
  )
}

export default UserSearchCard
