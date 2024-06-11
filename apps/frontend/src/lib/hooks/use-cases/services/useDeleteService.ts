import { SERVICES_QUERY_KEY } from "@/common/constants/query-keys"
import { useToast } from "@/components/ui/use-toast"
import { deleteService } from "@/lib/api/services"
import { ServicesEntity } from "@/lib/types/entities"
import { TGenericResponse } from "@/lib/types/responses"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteService = () => {
    
    const { toast } = useToast()
    const queryClient = useQueryClient()
    
    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteService,
        onSuccess: (resp: TGenericResponse<ServicesEntity>) => {
            toast({ description: resp.message, duration: 3000 })
            queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY })
        },
        onError: () => {
            toast({ variant: 'destructive', title: 'Error', description: 'Une erreur est survenue lors de la suppression du service' })
        }
    })

    return{
        deleteService: mutateAsync,
        isDeleting: isPending,
    }

}