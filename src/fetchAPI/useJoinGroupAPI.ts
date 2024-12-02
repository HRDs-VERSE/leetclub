import { useToast } from "@/hooks/use-toast";

type joinGroupData = {
    groupId: string
    userId: string
    type: 'collaborate' | 'university' | 'group' | "leetGroup" | "leetUniversity";
}

type getJoinGroupData = {
    userId?: string
    groupId?: string
    type?: 'collaborate' | 'university' | 'group' | "leetGroup" | "leetUniversity";
    page?: number
    limit?: number
}

type getLeaveGroupData = {
    groupId: string
    userId: string
}

type leaveGroupData = {
    groupId: string
    userId: string
}

const useJoinGroupAPI = () => {
    const { toast } = useToast()

    const joinGroup = async (joinGroupData: joinGroupData) => {
        try {
            const res = await fetch('/api/joinGroup/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(joinGroupData)
            })

            if (!res.ok) {
                console.error('Failed to join group')
            }

            const data = await res.json()
            toast({
                description: data.message,
              })
            return data

        } catch (error) {
            console.error('Error joining group:', error)
        }
    }

    const getJoinGroup = async ({ userId, groupId, type, page, limit }: getJoinGroupData) => {
        try {
            const queryParams = new URLSearchParams();

            if (userId) queryParams.append("userId", userId);
            if (groupId) queryParams.append("groupId", groupId);
            if (type) queryParams.append("type", type);
            if (page) queryParams.append("page", String(page));
            if (limit) queryParams.append("limit", String(limit));
            
    
            const res = await fetch(`/api/joinGroup/get?${queryParams.toString()}`);
            
            if (!res.ok) {
                console.error('Failed to fetch joined groups')
            }

            const data = await res.json()
            return data

        } catch (error) {
            console.error('Error fetching joined groups:', error)
        }
    }

    const leaveGroup = async (leaveGroupData: leaveGroupData) => {
        try {
            const res = await fetch('/api/joinGroup/leave', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leaveGroupData)
            })
            if (!res.ok) {
                console.error('Failed to leave group')
            }

            const data = await res.json()
            toast({
                description: data.message,
              })
            return data

        } catch (error) {
            console.error('Error leaving group:', error)
        }

    }


    return {
        joinGroup,
        getJoinGroup,
        leaveGroup
    }
}

export default useJoinGroupAPI