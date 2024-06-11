import { COMMANDS_QUERY_KEY } from "@/common/constants/query-keys"
import { fetchAllCommandsQuery } from "@/lib/api/commands"
import { useQuery } from "@tanstack/react-query"

export const useGetAllCommands = () => {
    const { data: commands, isLoading: isFecthing } = useQuery({
        queryKey: COMMANDS_QUERY_KEY,
        queryFn: fetchAllCommandsQuery,
        staleTime: 12000
    })

    return {
        commands,
        isFecthing
    }
}