import { COMMAND_INVOICES_ID_KEY } from "@/common/constants/query-keys"
import { useQuery } from "@tanstack/react-query"

type Params = {
    commandId: number
}

export const useGetAllCommandInvoices = ({commandId}: Params) =>{

    const {} = useQuery({
        queryKey: COMMAND_INVOICES_ID_KEY(commandId),
        queryFn
    })
}