import { COMMAND_ID_QUERY_KEY } from "@/common/constants/query-keys"
import { useToast } from "@/components/ui/use-toast"
import { CommandPaienmentSchema, updateCommand } from "@/lib/api/commands"
import { CommandsEntity } from "@/lib/types/entities"
import { TGenericAxiosError, TGenericResponse } from "@/lib/types/responses"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { z } from "zod"

type Params = {
    commandId: number
}

export const useUpdateCommand = ({commandId}: Params) => {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const {mutateAsync, isPending, isSuccess} = useMutation({
        mutationFn: async (data: z.infer<typeof CommandPaienmentSchema>) => await updateCommand(commandId, data),
        onError: (error: AxiosError<TGenericAxiosError>) => {
            const message = error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement du paiement"
            toast({
                variant: 'destructive',
                description: message,
                duration: 3000
            })
        },
        onSuccess: (data: TGenericResponse<CommandsEntity>) => {
            queryClient.invalidateQueries({ queryKey: COMMAND_ID_QUERY_KEY(commandId) })
            toast({
                description: data.message,
                duration: 3000
            })
        }
    })

    return{
        mutateAsync,
        isPending,
        isSuccess
    }
}