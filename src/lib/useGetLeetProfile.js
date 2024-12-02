import { useEffect, useState } from 'react';
import usePlatformAPI from '@/fetchAPI/usePlatformAPI';

const useGetLeetProfile = (userDetails) => {
  const { getLeetCodeProfile } = usePlatformAPI();
  const [leetCodeProfiles, setLeetCodeProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const profiles = await Promise.all(
          userDetails?.map(async (user) => {
            const leetCodePlatform = user.competitivePlatforms.find(
              ({ platformName }) => platformName === 'LeetCode'
            );
            
            return leetCodePlatform?.username
              ? { user, profile: await getLeetCodeProfile(leetCodePlatform.username) }
              : { user, profile: null };
          })
        );
        setLeetCodeProfiles(profiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userDetails?.length) fetchProfiles();
  }, [userDetails]);

  return { leetCodeProfiles, loading };
};

export default useGetLeetProfile;
