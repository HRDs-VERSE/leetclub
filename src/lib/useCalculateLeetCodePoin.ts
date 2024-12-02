import usePlatformAPI from "@/fetchAPI/usePlatformAPI";

const useCalculateLeetCodePoints = async (groups: any[]) => {
    const { getLeetCodeProfile } = usePlatformAPI();

    const fetchLeetCodeProfile = async (username: string) => {
        try {
            const response = await getLeetCodeProfile(username);
            const easy = response.easySolved || 0;
            const medium = response.mediumSolved || 0;
            const hard = response.hardSolved || 0;
            
            const points = easy * 5 + medium * 15 + hard * 20;
            const totalSolved = response.totalSolved;

            return {points, totalSolved, easy, medium, hard};
        } catch (error) {
            console.error(`Error fetching LeetCode profile for ${username}:`, error);
            return 0;
        }
    };

    for (const group of groups) {
        let groupPoints = 0;
        let totaQuestions = 0
        let totalEasy = 0
        let totalMedium = 0
        let totalHard = 0

        if (Array.isArray(group.userDetails)) {
            for (const user of group.userDetails) {
                const leetCodeProfile = user.competitivePlatforms.find(
                    (platform: any) => platform.platformName === "LeetCode"
                );

                if (leetCodeProfile?.username) {
                    const { points, totalSolved, easy, medium, hard }:any = await fetchLeetCodeProfile(leetCodeProfile.username);
                    groupPoints += points;
                    totaQuestions += totalSolved
                    totalEasy += easy
                    totalMedium += medium
                    totalHard += hard

                }
            }
        }

        group.totalPoints = groupPoints;
        group.totalQuestions = totaQuestions
        group.easyCount = totalEasy
        group.mediumCount = totalMedium
        group.hardCount = totalHard
    }

    groups.sort((a, b) => b.totalPoints - a.totalPoints);

    return groups;
};

const useFetchLeetCodePoints = async (groups: any) => {
    if (!groups) return;
    try {
        const result = await useCalculateLeetCodePoints(groups);
        return result 
    } catch (error) {
        console.error("Error fetching LeetCode points:", error);
    }
};


export default useFetchLeetCodePoints;
