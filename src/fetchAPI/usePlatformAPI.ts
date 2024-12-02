
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

    return {
        getLeetCodeProfile
    }
}

export default usePlatformAPI