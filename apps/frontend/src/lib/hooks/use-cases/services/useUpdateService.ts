import { SERVICE_ID_QUERY_KEY, SERVICES_QUERY_KEY } from "@/common/constants/query-keys";
import { useToast } from "@/components/ui/use-toast";
import { editService, ServiceFormSchema } from "@/lib/api/services";
import { TGenericAxiosError } from "@/lib/types/responses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import z from "zod"

type Params = {
    serviceId: number
}

export const useUpdateService = ({serviceId}: Params) => {
    const queryClient = useQueryClient()

    const { toast } = useToast()
    const { mutateAsync: updateService, isPending: isServiceUpdating } = useMutation({
        mutationFn: async (data: z.infer<typeof ServiceFormSchema>) => {
            if (!serviceId) {
                throw new Error("Service ID is undefined");
            }
            return await editService(data, +serviceId);
        },
        onError: (error: AxiosError<TGenericAxiosError>) => {
            console.log("🚀 ~ ServiceEditView ~ error:", error)
            const message = error.response?.data?.message || 'Une erreur est survenue lors de la modification du service'
            toast({
                variant: 'destructive',
                description: message,
            })
        },
        onSuccess: () => {
            if (serviceId) {
                queryClient.invalidateQueries({ queryKey: SERVICE_ID_QUERY_KEY(+serviceId) })
                queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY })
                toast({
                    variant: "success",
                    description: 'Service modifié avec succes',
                })
            }
            // navigate('/services')
        }
    })

    return {
        updateService,
        isServiceUpdating
    }
}