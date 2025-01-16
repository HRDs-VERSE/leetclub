

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
    try {
      const response = await fetch('/api/plateform/get-github-heatmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching GitHub heatmap:', error);
      throw error;
    }
  }
  

  const getGitHubCommits = async (username: string, privacy: boolean, loadMore: boolean = false) => {
    try {
      // Store cursor in hook's local storage to maintain state between calls
      let cursor = loadMore ? localStorage.getItem(`github-cursor-${username}`) : null;

      const response = await fetch('/api/plateform/get-github-commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          privacy,
          cursor 
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }

      // Store the new cursor for next pagination request
      if (result.data.pageInfo.endCursor) {
        localStorage.setItem(`github-cursor-${username}`, result.data.pageInfo.endCursor);
      }

      // If no more pages, clean up storage
      if (!result.data.pageInfo.hasNextPage) {
        localStorage.removeItem(`github-cursor-${username}`);
      }

      return {
        repositories: result.data.repositories,
        hasMore: result.data.pageInfo.hasNextPage,
      };

    } catch (error) {
      console.error('Error fetching GitHub commits:', error);
      throw error;
    }
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