const getLeetCodeData = async (username: string) => {
    const graphqlQuery = {
      query: `
        query userProblemsSolved($username: String!) {
          allQuestionsCount {    
            difficulty    
            count  
          }
          matchedUser(username: $username) {
            problemsSolvedBeatsStats { 
              difficulty
              percentage    
            }
            submitStatsGlobal {
              acSubmissionNum {        
                difficulty        
                count      
              }    
            }
          }             
        }
      `,
      variables: { username },
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
  
      return await response.json();
      
    } catch (err: any) {
      throw new Error(`Failed to fetch LeetCode data: ${err.message}`);
    }
  };
  
  export default getLeetCodeData