

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



  return {
    getLeetCodeProfile,
    getGitHubHeatMap,
    newLeetCodeAPI,
    getCollaborateProfile,
    getLeetCodeGroup
  }
}

export default usePlatformAPI