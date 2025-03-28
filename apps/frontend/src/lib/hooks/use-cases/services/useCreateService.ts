import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ServiceFormSchema, createService } from "@/lib/api/services"
import { z } from "zod"
import { ServicesEntity } from "@/lib/types/entities"
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { SERVICES_QUERY_KEY } from "@/common/constants/query-keys";
import { TGenericAxiosError, TGenericResponse } from "@/lib/types/responses";
import { useAuth } from "../useAuth";


export const useCreateService = () => {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const agencyId = useAuth.getState().selectedAgency?.id

    const { mutateAsync, isPending, isSuccess } = useMutation({
        mutationFn: async (data: z.infer<typeof ServiceFormSchema>) => await createService(data),
        onError: (error: AxiosError<TGenericAxiosError>) => {
            const message = error.response?.data?.message || 'Une erreur est survenue lors de la création du service'
            toast({
                variant: 'destructive',
                description: message,
                duration: 7000
            })
        },
        onSuccess: (data: TGenericResponse<ServicesEntity>) => {
            queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY({agencyId}) })
            toast({
                variant: 'success',
                description: data.message,
                duration: 3000
            })
        }
    })

    return {
        createService: mutateAsync,
        isCreating: isPending,
        isSuccess
    }
}