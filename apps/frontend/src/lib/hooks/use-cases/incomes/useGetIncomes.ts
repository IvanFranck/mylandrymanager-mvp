import { INCOMES_FILTER_QUERY_KEY } from "@/common/constants/query-keys"
import { getIncomesStats } from "@/lib/api/incomes"
import { IncomesQueriesType } from "@/lib/types/query.filter.types"
import { useQuery } from "@tanstack/react-query"

type Params = {
    filters : IncomesQueriesType
}

export const useGetIncomes = ({filters}: Params) => {

    const { data, isLoading: isFecthing } = useQuery({
        queryKey: INCOMES_FILTER_QUERY_KEY({...filters}),
        queryFn: ()=>getIncomesStats({...filters}),
        staleTime: 0
    })
    
    return {
        data,
        isFecthing
    }
}