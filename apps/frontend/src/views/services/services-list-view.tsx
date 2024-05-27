import { SERVICES_QUERY_KEY } from "@/common/constants/query-keys"
import { ServiceListItem } from "@/components/app/services/service-list-item"
import { ServiceListItemSkeleton } from "@/components/app/services/service-list-item-skeloton"
import { fetchAllServicesQuery } from "@/lib/api/services"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { useRef, useState } from "react"
import { deleteService } from "@/lib/api/services";
import { TGenericResponse } from "@/lib/types/responses"
import { ServicesEntity } from "@/lib/types/entities"
import { useToast } from "@/components/ui/use-toast"
import { Loader } from "lucide-react"


export default function ServicesListView() {

    const [deletingServiceId, setDeletingServiceId] = useState<number>(-1)
    const triggerBtn = useRef(null)
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const { data: services } = useQuery({
        queryKey: SERVICES_QUERY_KEY,
        queryFn: fetchAllServicesQuery,
        staleTime: 12000
    })
    const triggerServiceDeletion = (id: number) => {
        setDeletingServiceId(id)
        triggerBtn.current.click()
    }

    const handleServiceDeletion = async (id: number) => {
        if (deletingServiceId === -1) return;
        await mutateAsync(id)
        setDeletingServiceId(-1)
    }
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

    return (
        <div className="px-2">
            {
                services ?
                    services.map((service) => <ServiceListItem onDelete={triggerServiceDeletion} service={service} key={service.id} />)
                    : <ServiceListItemSkeleton />
            }

            <Dialog>
                <DialogTrigger asChild>
                    <Button ref={triggerBtn} variant='ghost' className="space-x-2 hidden">
                        <span>Supprimer</span>
                    </Button>
                </DialogTrigger>
                <DialogOverlay className="fixed top-0 left-0 right-0 bottom-0 overflow-y-auto grid place-items-center bg-black/[0.5]">

                    <DialogContent className="w-full grid place-items-center">
                        <Card className="w-5/6">
                            <CardHeader>

                                <DialogHeader>
                                    <DialogTitle className="text-lg font-medium">Attention</DialogTitle>
                                    <DialogDescription>
                                        Voulez-vous vraiment supprimer ce service "<strong>{services?.find((service) => service.id === deletingServiceId)?.label}</strong>" ?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="w-full flex justify-between flex-row">
                                    <DialogClose disabled={isPending} asChild>
                                        <Button variant='outline'>Annuler</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button disabled={isPending} variant='destructive' onClick={() => handleServiceDeletion(deletingServiceId)}>
                                            Supprimer
                                            {isPending && <Loader size={18} className="animate-spin ml-3" />}
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </CardHeader>
                        </Card>
                    </DialogContent>
                </DialogOverlay>
            </Dialog>
        </div>
    )
}