import { useEffect, useState } from 'react';
import usePlatformAPI from "@/fetchAPI/usePlatformAPI";

const useFetchLeetCodePoints = (groups: any[]) => {
  const { getLeetCodeProfile } = usePlatformAPI();
  const [sortedGroups, setSortedeGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeetCodeProfile = async (username: string) => {
    try {
      const response = await getLeetCodeProfile(username);
      const easy = response.easySolved || 0;
      const medium = response.mediumSolved || 0;
      const hard = response.hardSolved || 0;

      const points = easy * 5 + medium * 15 + hard * 20;
      const totalSolved = response.totalSolved;

      return { points, totalSolved, easy, medium, hard };
    } catch (error) {
      console.error(`Error fetching LeetCode profile for ${username}:`, error);
      return { points: 0, totalSolved: 0, easy: 0, medium: 0, hard: 0 };
    }
  };

  useEffect(() => {
    const calculateLeetCodePoints = async () => {
      setLoading(true);
      setError(null);

      try {
        const updatedGroups = await Promise.all(
          groups.map(async (group) => {
            let groupPoints = 0;
            let totalQuestions = 0;
            let totalEasy = 0;
            let totalMedium = 0;
            let totalHard = 0;

            if (Array.isArray(group.userDetails)) {
              for (const user of group.userDetails) {
                const leetCodeProfile = user.competitivePlatforms.find(
                  (platform: any) => platform.platformName === "LeetCode"
                );

                if (leetCodeProfile?.username) {
                  const { points, totalSolved, easy, medium, hard } = await fetchLeetCodeProfile(leetCodeProfile.username);
                  groupPoints += points;
                  totalQuestions += totalSolved;
                  totalEasy += easy;
                  totalMedium += medium;
                  totalHard += hard;
                }
              }
            }

            return {
              ...group,
              totalPoints: groupPoints,
              totalQuestions,
              easyCount: totalEasy,
              mediumCount: totalMedium,
              hardCount: totalHard,
            };
          })
        );

        updatedGroups.sort((a, b) => b.totalPoints - a.totalPoints);
        setSortedeGroups(updatedGroups);
      } catch (error) {
        console.error("Error calculating LeetCode points:", error);
        setError("An error occurred while fetching LeetCode points.");
      } finally {
        setLoading(false);
      }
    };

    if (groups && groups.length > 0) {
      calculateLeetCodePoints();
    }
  }, [groups, getLeetCodeProfile]);

  return { sortedGroups, loading, error };
};

export default useFetchLeetCodePoints;
