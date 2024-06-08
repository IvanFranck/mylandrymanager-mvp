import { SERVICES_QUERY_KEY } from "@/common/constants/query-keys"
import { fetchAllServicesQuery } from "@/lib/api/services"
import { useQuery } from "@tanstack/react-query"

export const useGetAllServices = () => {
    const { data: services, isLoading } = useQuery({
        queryKey: SERVICES_QUERY_KEY,
        queryFn: fetchAllServicesQuery,
        staleTime: 12000
    })

    return {
        services,
        isFetching: isLoading
    }
}