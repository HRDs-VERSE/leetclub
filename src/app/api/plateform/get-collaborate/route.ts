import getLeetCodeData from '@/lib/getLeetCodeProfile';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async(req: NextRequest) => {
  
  try {
    const { userDetails } = await req.json();

    if (!Array.isArray(userDetails) || userDetails.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request. Provide a non-empty array of user details.',
      },{status: 400});
    }

    const profiles = await Promise.all(
      userDetails.map(async (user: any) => {
        const leetCodePlatform = user.competitivePlatforms?.find(
          (platform: any) => platform.platformName === 'LeetCode'
        );

        if (!leetCodePlatform?.username) {
          return { user, profile: null };
        }

        try {
          const profile = await getLeetCodeData(leetCodePlatform.username);

          const destructureProfile = profile.data.matchedUser.submitStatsGlobal.acSubmissionNum
          
          return { user, profile: destructureProfile };
        } catch (error) {
          console.error(`Error fetching LeetCode profile for ${leetCodePlatform.username}:`, error);
          return { user, profile: null };
        }
      })
    );

    return NextResponse.json({
      success: true,
      message: 'LeetCode profiles fetched successfully.',
      data: profiles,
    },{status: 200});

  } catch (error) {
    console.error('Error in API handler:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error',
    }, {status: 500});
  }
}
