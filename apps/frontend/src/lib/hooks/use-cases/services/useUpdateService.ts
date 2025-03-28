import { SERVICE_ID_QUERY_KEY, SERVICES_QUERY_KEY } from "@/common/constants/query-keys";
import { useToast } from "@/components/ui/use-toast";
import { editService, ServiceEditFormSchema } from "@/lib/api/services";
import { GenericQueryType } from "@/lib/types/query.filter.types";
import { TGenericAxiosError } from "@/lib/types/responses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import z from "zod"

type Params = {
    serviceId: number,
    query: GenericQueryType
}

export const useUpdateService = ({serviceId, query}: Params) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate();

    const { toast } = useToast()
    const { mutateAsync: updateService, isPending: isServiceUpdating } = useMutation({
        mutationFn: async (data: z.infer<typeof ServiceEditFormSchema>) => {
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
                queryClient.invalidateQueries({ queryKey: SERVICE_ID_QUERY_KEY(+serviceId, query) })
                queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY(query) })
                toast({
                    variant: "success",
                    description: 'Service modifié avec succes',
                })
            }
            navigate('/services')
        }
    })

    return {
        updateService,
        isServiceUpdating
    }
}