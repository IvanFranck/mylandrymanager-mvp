import { USER_PROFILE_QUERY_KEY } from "@/common/constants/query-keys"
import { fetchUserInfosQuery } from "@/lib/api/profile"
import { useQuery } from "@tanstack/react-query"

export const useGetUserProfileInfos = () => {
  const {data: userProfile, isLoading} = useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: fetchUserInfosQuery,
    staleTime: Infinity,
  })

  return {
    userProfile,
    isFetching: isLoading
  }
}