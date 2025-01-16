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

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query ($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }`,
        variables: { username },
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'GitHub heatmap data fetched successfully.',
      data: data.data?.user?.contributionsCollection,
    }, { status: 200 });

  } catch (error) {
    console.error('Error in API handler:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error',
    }, { status: 500 });
  }
}