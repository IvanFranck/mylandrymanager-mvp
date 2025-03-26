import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod";
import { CommandSchema, createCommandQuery } from "@/lib/api/commands";
import { AxiosError } from "axios";
import { TGenericAxiosError, TGenericResponse } from "@/lib/types/responses";
import { CommandsEntity } from "@/lib/types/entities";
import { COMMANDS_FILTER_QUERY_KEY } from "@/common/constants/query-keys";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useCreateCommand = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const navigate = useNavigate()
    const { 
        mutateAsync: createCommand, 
        isPending: creatingCommand, 
        isSuccess: createCommandSucced, 
        isError: createCommandFailed
    } = useMutation({
        mutationFn: async (data: z.infer<typeof CommandSchema>) => await createCommandQuery(data),
        onError: (error: AxiosError<TGenericAxiosError>) => {
            const message = error.response?.data?.message || 'Une erreur est survene lors de ma crétaion de la commande'
            toast({
                variant: 'destructive',
                description: message,
                duration: 7000
            })
        },
        onSuccess: (data: TGenericResponse<CommandsEntity>) => {
            queryClient.invalidateQueries({ queryKey: COMMANDS_FILTER_QUERY_KEY({}) })
            toast({
                variant: 'success',
                description: data.message,
                duration: 3000
            })
            navigate('/commands')
        }
    })  
    
    return {
        createCommand,
        creatingCommand, 
        createCommandSucced, 
        createCommandFailed
    }
}