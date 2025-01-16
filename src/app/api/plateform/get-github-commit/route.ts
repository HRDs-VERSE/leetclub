// app/api/github/commits/route.ts
import { NextRequest, NextResponse } from 'next/server';

const PER_PAGE = 10; // Repositories per page

export const POST = async (req: NextRequest) => {
  try {
    const { username, privacy, cursor } = await req.json();

    if (!username) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request. Provide a username',
      }, { status: 400 });
    }

    const query = `
      query ($username: String!, $first: Int!, $after: String ${privacy ? ", $privacy: RepositoryPrivacy!" : ""}) {
        user(login: $username) {
          repositories(
            first: $first, 
            after: $after,
            ownerAffiliations: [OWNER, COLLABORATOR]
            ${privacy ? ", privacy: $privacy" : ""}
            orderBy: {field: UPDATED_AT, direction: DESC}
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              name
              refs(first: 10, refPrefix: "refs/heads/") {
                nodes {
                  target {
                    ... on Commit {
                      history(first: 100) {
                        edges {
                          node {
                            committedDate
                            message
                            author {
                              name
                              email
                              user {
                                login
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          username,
          first: PER_PAGE,
          after: cursor || null,
          ...(privacy && { privacy: "PUBLIC" })
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json({
        success: false,
        message: 'GitHub API Error',
        errors: data.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'GitHub commits data fetched successfully.',
      data: {
        repositories: data.data?.user?.repositories?.nodes || [],
        pageInfo: data.data?.user?.repositories?.pageInfo,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error in API handler:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error',
    }, { status: 500 });
  }
}