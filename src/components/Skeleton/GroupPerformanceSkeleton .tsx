import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton } from "./CardSkeleton";

const GroupPerformanceSkeleton = () => {
    return (
        <div className="container mx-auto p-4 space-y-6 max-w-[45rem] m-auto">
            {/* Group Header */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" /> {/* Group name */}
                <Skeleton className="h-6 w-40" /> {/* Tagline */}
            </div>

            {/* FriendPerformance List */}
            <div className="grid gap-6 grid-cols-1">
                <CardSkeleton />
            </div>
        </div>
    );
};

export default GroupPerformanceSkeleton;
