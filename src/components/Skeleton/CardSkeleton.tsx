import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <div className="w-full">
      {/* Card Header Skeleton */}
      <div className="flex justify-between items-center mb-4">
        {/* Left Section: Name and Member Count */}
        <div className="flex gap-2 items-center">
          <Skeleton className="h-5 w-24" /> {/* Name Placeholder */}
          <Skeleton className="h-4 w-20" /> {/* Members Count Placeholder */}
        </div>
        {/* Right Section: Users Icon */}
        <Skeleton className="h-5 w-5" />
      </div>

      {/* Card Content Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-4 w-full" /> {/* Tagline Placeholder */}
      </div>

      {/* Card Footer Skeleton */}
      <div>
        <Skeleton className="h-10 w-full" /> {/* Button Placeholder */}
      </div>
    </div>
  );
}
