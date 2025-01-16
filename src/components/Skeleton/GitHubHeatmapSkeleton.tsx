import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const GitHubHeatmapSkeleton = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "repeat(7, 10px)", // 7 days in a week
        gridAutoFlow: "column", // Flip the layout to match GitHub's style
        gap: "1px",
        maxWidth: "100%",
        overflowX: "auto",
        scrollbarWidth: "thin", // For Firefox
        WebkitOverflowScrolling: "touch", // Smooth scrolling on mobile
      }}
    >
      {Array.from({ length: 7 }).map((_, rowIndex) => (
        Array.from({ length: 53 }).map((_, colIndex) => ( // 53 weeks in a year
          <Skeleton
            key={`${rowIndex}-${colIndex}`}
            className="w-[10px] h-[10px] rounded-[2px]"
          />
        ))
      ))}

      <style>{`
        div::-webkit-scrollbar {
          height: 4px; /* Adjust the height for horizontal scrollbar */
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 100, 0.5); /* Dark gray scroll thumb */
          border-radius: 2px; /* Rounded corners */
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 100, 100, 0.8); /* Slightly darker on hover */
        }
        div::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1); /* Light track background */
        }
      `}</style>
    </div>
  );
};

export default GitHubHeatmapSkeleton;
