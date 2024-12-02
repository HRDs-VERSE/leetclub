import { useEffect, useState } from 'react';
import usePlatformAPI from '@/fetchAPI/usePlatformAPI';

const useGetLeetProfile = (group) => {
  const { getLeetCodeProfile } = usePlatformAPI();
  const [leetCodeProfiles, setLeetCodeProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      console.log(group)
      setLoading(true);
      try {
        const profiles = await Promise.all(
          group[0].userDetails?.map(async (user) => {
            const leetCodePlatform = user.competitivePlatforms.find(
              ({ platformName }) => platformName === 'LeetCode'
            );
            console.log(leetCodePlatform)
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

    if (group?.length) fetchProfiles();
  }, [group]);
  console.log(leetCodeProfiles)

  return { leetCodeProfiles, loading };
};

export default useGetLeetProfile;

// await Promise.all(
//   group[0].userDetails?.map(async (user) => {
//     const leetCodePlatform = user.competitivePlatforms.find(
//       (platform) => platform.platformName === 'LeetCode'
//     );
//     if (leetCodePlatform && leetCodePlatform.username) {

//       const profile = await getLeetCodeProfile(leetCodePlatform.username);
//       return { user, profile };
//     }
//     return { user, profile: null };
//   })