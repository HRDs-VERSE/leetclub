

const usePlatformAPI = () => {
  const getLeetCodeProfile = async (username: string) => {
    try {
      const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`)

      if (!res.ok) {
        console.error('Failed to fetch LeetCode profile')
      }

      const data = await res.json()
      return data

    } catch (error) {
      console.error('Error fetching LeetCode profile:', error)
    }
  }


  const newLeetCodeAPI = async (username: string) => {

    try {
      const response = await fetch(`/api/plateform?username=${username}`)

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result.data.data

    } catch (err) {
      console.error(`HTTP error! Status: ${err}`);
    }
  }

  const getGitHubHeatMap = async (username: string) => {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
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
    return data.data?.user?.contributionsCollection;
  }

  const getGitHubCommits = async (username: string, privacy: boolean) => {
    const variables: any = {
      username: username,
    };

    if (privacy) {
      variables.privacy = "PUBLIC";
    }

    const query = `query ($username: String! ${privacy ? ", $privacy: RepositoryPrivacy!" : ""}) {
      user(login: $username) {
        repositories(first: 100, ownerAffiliations: [OWNER, COLLABORATOR] ${privacy ? ", privacy: $privacy" : ""
      }) {
          nodes {
            name
            isPrivate
            owner {
              login
            }
            refs(first: 1, refPrefix: "refs/heads/") {
              nodes {
                target {
                  ... on Commit {
                    history(first: 100) {
                      totalCount
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
    }`;


    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();
    return data.data.user.repositories.nodes;

  };

  const getCollaborateProfile = async (userData: any) => {
    try {
      const response = await fetch('/api/plateform/get-collaborate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userDetails: userData }),
      });

      const data = await response.json();
      return data.data;

    } catch (error) {
      console.error('Error fetching LeetCode data:', error);
    }
  }

  const getLeetCodeGroup = async (groups: any) => {
    try {
      const response = await fetch('/api/plateform/get-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groups }),
      });

      const data = await response.json();
      return data.data;

    } catch (error) {
      console.error('Error fetching LeetCode data:', error);
    }
  }

  const getLeetCodeHeatmap = async (username: string) => {
    try {
      const response = await fetch('/api/plateform/get-leet-heatmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      return data.profile;

    } catch (error) {
      console.error('Error fetching LeetCode data:', error);
    }
  }

  const getLeetCodeQuestionSolved = async (username: string) => {
    try {
      const response = await fetch('/api/plateform/get-leet-user-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      return data.data;
      
    } catch (error) {
      console.error("Error fetching LeetCode data:", error);
    }
  };  
  


  return {
    getLeetCodeProfile,
    getGitHubHeatMap,
    getGitHubCommits,
    newLeetCodeAPI,
    getCollaborateProfile,
    getLeetCodeGroup,
    getLeetCodeHeatmap,
    getLeetCodeQuestionSolved
  }
}

export default usePlatformAPI