import usePlatformAPI from "@/fetchAPI/usePlatformAPI";

const useGetLeetProfile = async (group) => {
  const { getLeetCodeProfile } = usePlatformAPI()

  const leetCodeProfiles = await Promise.all(
    group[0].userDetails?.map(async (user) => {
      const leetCodePlatform = user.competitivePlatforms.find(
        (platform) => platform.platformName === 'LeetCode'
      );
      if (leetCodePlatform && leetCodePlatform.username) {

        const profile = await getLeetCodeProfile(leetCodePlatform.username);
        return { user, profile };
      }
      return { user, profile: null };
    })
  );
  return leetCodeProfiles;
};

export default useGetLeetProfile;

