import { COMMANDS_FILTER_QUERY_KEY } from "@/common/constants/query-keys"
import { fetchAllCommandsQuery } from "@/lib/api/commands"
import { CommandQueriesType } from "@/lib/types/query.filter.types"
import { useQuery } from "@tanstack/react-query"

type Params = {
    filters? : CommandQueriesType
}

export const useGetAllCommands = ({filters}: Params) => {

    const { data: commands, isLoading: isFecthing } = useQuery({
        queryKey: COMMANDS_FILTER_QUERY_KEY({...filters}),
        queryFn: ()=>fetchAllCommandsQuery({...filters}),
        staleTime: 12000
    })

    return {
        commands,
        isFecthing
    }
}