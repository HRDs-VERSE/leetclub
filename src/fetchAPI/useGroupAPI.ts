type groupData = {
    name: string
    type: 'collaborate' | 'university' | 'group';
    adminId: string
    tagLine?: string;
}

type getGroupData = {
    adminId?: string
    type?: string;
    page?: number
    limit?: number
}

const useGroupAPI = () => {
    const createGroup = async (groupData: groupData) => {
        try {
            const res = await fetch('/api/group/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(groupData)
            })

            if (!res.ok) {
                console.error('Failed to create group')
            }

            const data = await res.json()
            return data

        } catch (error) {
            console.error('Error creating group:', error)
        }
    }

    const getGroup = async ({ adminId, type, page, limit }: getGroupData) => {
        
        const queryParams = new URLSearchParams();

        if(adminId) queryParams.append("adminId", adminId)
        if (type) queryParams.append("type", type);
        if (page) queryParams.append("page", String(page));
        if (limit) queryParams.append("limit", String(limit));

        try {
            const res = await fetch(`/api/group/get/?${queryParams.toString()}`)
            if (!res.ok) {
                console.error('Failed to fetch groups')
            }

            const data = await res.json()
            return data

        } catch (error) {
            console.error('Error fetching groups:', error)
        }
    }

    const getAllGroup = async ({type, page, limit}:any) => {
        try {
            const res = await fetch(`/api/group/get-all?type=${type}&page=${page}&limit=${limit}`)
            if (!res.ok) {
                console.error('Failed to fetch groups')
            }

            const data = await res.json()
            return data

        } catch (error) {
            console.error('Error fetching groups:', error)
        }

    }

    const searchGroup = async (query: string, page: number, limit: number, userId: string) => {
        try {
            const res = await fetch(`/api/group/search?query=${query}&page=${page}&limit=${limit}&userId=${userId}`)
            if (!res.ok) {
                console.error('Failed to search groups')
            }

            const data = await res.json()
            return data

        } catch (error) {
            console.error('Error searching groups:', error)
        }
    }

    return {
        createGroup,
        getGroup,
        getAllGroup,
        searchGroup
    }
}

export default useGroupAPI