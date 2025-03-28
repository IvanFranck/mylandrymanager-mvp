import { SERVICES_QUERY_KEY } from "@/common/constants/query-keys"
import { fetchAllServicesQuery } from "@/lib/api/services"
import { GenericQueryType } from "@/lib/types/query.filter.types"
import { useQuery } from "@tanstack/react-query"

export const useGetAllServices = (query:GenericQueryType) => {
    const { data: services, isLoading } = useQuery({
        queryKey: SERVICES_QUERY_KEY(query),
        queryFn: () => fetchAllServicesQuery(query),
        staleTime: 12000
    })

    return {
        services,
        isFetching: isLoading
    }
}