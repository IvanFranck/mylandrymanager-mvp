import { ServiceListItem } from "@/components/app/services/service-list-item"
import { ServiceListItemSkeleton } from "@/components/app/services/service-list-item-skeloton"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { useRef, useState } from "react"
import { Loader } from "lucide-react"
import { useDeleteService } from "@/lib/hooks/use-cases/services/useDeleteService"
import { useGetAllServices } from "@/lib/hooks/use-cases/services/useGetAllServices"
import { NoDataIllustration } from "@/components/illustrations/no-data-illustration"


export default function ServicesListView() {

    const [deletingServiceId, setDeletingServiceId] = useState<number>(-1)
    const triggerBtn = useRef<HTMLButtonElement>(null)
    const {deleteService, isDeleting} = useDeleteService()

    const { services, isFetching } = useGetAllServices()
    const triggerServiceDeletion = (id: number) => {
        setDeletingServiceId(id)
        triggerBtn.current?.click()
    }

    const handleServiceDeletion = async (id: number) => {
        if (deletingServiceId === -1) return;
        await deleteService(id)
        setDeletingServiceId(-1)
    }

    return (
        <div className="px-2">
            {   isFetching ?
                    <ServiceListItemSkeleton />
                    :   services && services.length ?
                            services.map((service) => <ServiceListItem className="mb-4" onDelete={triggerServiceDeletion} service={service} key={service.id} />)
                            : <div className="w-full px-3">
                                <NoDataIllustration text="Oops! Votre catalogue de service est vide 😅. Veillez enregistrer votre premier service "/>
                            </div>
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
                                    <DialogClose disabled={isDeleting} asChild>
                                        <Button variant='outline'>Annuler</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button disabled={isDeleting} variant='destructive' onClick={() => handleServiceDeletion(deletingServiceId)}>
                                            Supprimer
                                            {isDeleting && <Loader size={18} className="animate-spin ml-3" />}
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