import getLeetCodeData from '@/lib/getLeetCodeProfile';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest,) =>{
  
  try {
    const { groups } = await  req.json();

    if (!Array.isArray(groups) || groups.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request. Provide a non-empty array of groups.',
      }, {status: 400});
    }

    const updatedGroups = await Promise.all(
      groups.map(async (group: any) => {
        let groupPoints = 0;
        let totalQuestions = 0;
        let totalEasy = 0;
        let totalMedium = 0;
        let totalHard = 0;

        if (Array.isArray(group.userDetails)) {
          for (const user of group.userDetails) {
            const leetCodePlatform = user.competitivePlatforms.find(
              (platform: any) => platform.platformName === 'LeetCode'
            );

            if (leetCodePlatform?.username) {
              try {
                const leetCodeData = await getLeetCodeData(leetCodePlatform.username);
                const destructureProfile = leetCodeData.data.matchedUser.submitStatsGlobal.acSubmissionNum
                const easy = destructureProfile[1]?.count || 0;

                const medium = destructureProfile[2]?.count || 0;

                const hard = destructureProfile[3]?.count || 0;

                const totalSolved = easy + medium + hard;
                const points = easy * 5 + medium * 15 + hard * 20;

                groupPoints += points;
                totalQuestions += totalSolved;
                totalEasy += easy;
                totalMedium += medium;
                totalHard += hard;
              } catch (error) {
                console.error(`Error fetching LeetCode data for ${leetCodePlatform.username}:`, error);
              }
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

    return NextResponse.json({
      success: true,
      message: 'LeetCode points calculated successfully.',
      data: updatedGroups,
    }, {status: 200});
  } catch (error) {
    console.error('Error in API handler:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error',
    }, {status: 500});
  }
}
