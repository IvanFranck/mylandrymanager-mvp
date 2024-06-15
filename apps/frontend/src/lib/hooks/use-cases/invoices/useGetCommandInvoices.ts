import { COMMAND_INVOICES_ID_KEY } from "@/common/constants/query-keys"
import { fetchAllCommandInvoices } from "@/lib/api/invoices"
import { useQuery } from "@tanstack/react-query"

type Params = {
    commandId: number
}

export const useGetAllCommandInvoices = ({commandId}: Params) =>{

    const {data: commandInvoices, isPending: isInvoicesLoading} = useQuery({
        queryKey: COMMAND_INVOICES_ID_KEY(commandId),
        queryFn: () => fetchAllCommandInvoices(commandId),
        staleTime: 12000,

    })

    return{
        commandInvoices,
        isInvoicesLoading
    }
}