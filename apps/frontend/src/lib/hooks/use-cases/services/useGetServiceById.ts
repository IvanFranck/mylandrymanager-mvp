import { SERVICE_ID_QUERY_KEY, SERVICES_QUERY_KEY } from "@/common/constants/query-keys"
import { fetchServiceById } from "@/lib/api/services"
import { ServicesEntity } from "@/lib/types/entities"
import { GenericQueryType } from "@/lib/types/query.filter.types"
import { useQuery, useQueryClient } from "@tanstack/react-query"

type Params = {
    serviceId: number,
    query: GenericQueryType
}

export const useGetServiceById  = ({serviceId, query}: Params) => {
    const queryClient = useQueryClient()
   
    const { data: service, isLoading: isServiceLoading } = useQuery({
        queryKey: SERVICE_ID_QUERY_KEY(serviceId, query),
        queryFn: () => fetchServiceById(serviceId, query),
        staleTime: 12000,
        placeholderData: () => {
            const service: ServicesEntity[] | undefined = queryClient.getQueryData(SERVICES_QUERY_KEY(query))
            return service?.find(service => service.id === serviceId)
        }
    })

    return{
        service,
        isServiceLoading
    }
}