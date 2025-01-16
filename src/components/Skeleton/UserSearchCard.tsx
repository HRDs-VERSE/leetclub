import { Skeleton } from "@/components/ui/skeleton";

export function UserSearchCardSkeleton() {
  return (
    <div className="flex gap-3 hover:bg-neutral-800 p-1 rounded-[8px]">
      {/* Avatar Skeleton */}
      <Skeleton className="w-[3rem] h-[3rem] rounded-full" />

      {/* Text Content Skeleton */}
      <div className="flex flex-col gap-1 justify-center">
        <Skeleton className="h-4 w-[8rem]" /> {/* Username Placeholder */}
        <Skeleton className="h-3 w-[6rem]" /> {/* Optional email or other placeholder */}
      </div>
    </div>
  );
}
