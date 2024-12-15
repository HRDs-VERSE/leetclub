const getLeetCodeUserQues = async (username: string) => {
    console.log(username)
    try {
      const graphqlQuery = JSON.stringify({
        query: `
          query recentAcSubmissions($username: String!, $limit: Int!) {
            recentAcSubmissionList(username: $username, limit: $limit) {
              id    
              title    
              titleSlug    
              timestamp
            }
          }
        `,
        variables: {
          username: username,
          limit: 25, 
        },
      });
  
      const response = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": process.env.LEETCODE_COOKIE as string,
        },
        body: graphqlQuery,
      });
  
      const result = await response.json();
      const recentSubmissions = result.data?.recentAcSubmissionList;
  
      if (!recentSubmissions || recentSubmissions.length === 0) {
        console.log("No recent submissions found.");
        return;
      }
  
      const difficulties = await Promise.all(
        recentSubmissions.map(async (submission: any) => {
          const questionQuery = JSON.stringify({
            query: `
              query questionDifficulty($titleSlug: String!) {
                question(titleSlug: $titleSlug) {
                  difficulty
                }
              }
            `,
            variables: {
              titleSlug: submission.titleSlug,
            },
          });
  
          const questionResponse = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cookie": process.env.LEETCODE_COOKIE as string,
            },
            body: questionQuery,
          });
  
          const questionResult = await questionResponse.json();
          const difficulty = questionResult.data?.question?.difficulty;
  
          return {
            ...submission,
            difficulty: difficulty || "Unknown",
          };
        })
      );
  
      return difficulties;
    } catch (error) {
      console.error("Error fetching LeetCode data:", error);
    }
  };  

export default getLeetCodeUserQues;