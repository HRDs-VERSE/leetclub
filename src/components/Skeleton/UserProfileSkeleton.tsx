import { Skeleton } from "@/components/ui/skeleton";
import GitHubHeatmapSkeleton from "./GitHubHeatmapSkeleton";
import { CardSkeleton } from "./CardSkeleton";

export function UserProfileSkeleton() {
    return (
        <div className="container mx-auto p-4 space-y-6 max-w-[45rem] m-auto">
            <div className="space-y-6">
                {/* Avatar and Username */}
                <div className="flex items-center space-x-4">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <Skeleton className="h-8 w-40" />
                </div>

                {/* Button */}
                <Skeleton className="h-10 w-32 rounded-md" />

                {/* GitHub Contributions Section */}
                {Array.from({ length: 2 }).map((_, idx) => (
                    <div className="flex flex-col gap-2" key={idx}>
                        <Skeleton className="h-6 w-48" /> {/* "GitHub Contributions" header */}
                        <Skeleton className="h-4 w-64" /> {/* Contribution count */}
                        <GitHubHeatmapSkeleton /> {/* Heatmap placeholder */}
                        <Skeleton className="h-6 w-full rounded-md" /> {/* Commits placeholder */}
                    </div>
                ))}
                <div>
                    <CardSkeleton/>
                </div>
            </div>
        </div>
    );
}
