const getLeetCodeHeatmap = async (username: string) => {

    const graphqlQuery = {
        query: `
          query userProfileCalendar($username: String!, $year: Int) {
            matchedUser(username: $username) {
              userCalendar(year: $year) {
                activeYears
                streak
                totalActiveDays
                dccBadges {
                  timestamp
                  badge {
                    name
                    icon
                  }
                }
                submissionCalendar
              }
            }
          }
        `,
        variables: { username: username },
      };
      
  
    try {
      const response = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": process.env.LEETCODE_COOKIE as string,
        },
        body: JSON.stringify(graphqlQuery),
      });
        
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data
      
    } catch (err: any) {
      throw new Error(`Failed to fetch LeetCode data: ${err.message}`);
    }
  };
  
  export default getLeetCodeHeatmap