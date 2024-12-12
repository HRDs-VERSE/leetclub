import getLeetCodeHeatmap from '@/lib/getLeetCodeHeatmap';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {

  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request. Provide a username',
      }, { status: 400 });
    }

    const profile = await getLeetCodeHeatmap(username);

    const destructureProfile = profile.data.matchedUser.userCalendar

    return NextResponse.json({
      success: true,
      message: 'LeetCode profiles fetched successfully.',
      profile: destructureProfile,
    }, { status: 200 });

  } catch (error) {
    console.error('Error in API handler:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error',
    }, { status: 500 });
  }
}
