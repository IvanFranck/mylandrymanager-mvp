import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerOverlay, DrawerPortal, DrawerTrigger, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { Loader } from "lucide-react"
import { ServiceFormSchema } from "@/lib/api/services"
import z from "zod"
import { Plus } from "lucide-react"
import { ServicesEntity } from "@/lib/types/entities"
import { RefObject, useRef } from "react"
import { useCreateService } from "@/lib/hooks/use-cases/services/useCreateService"
import { GenericForm } from "@/components/ui/generic-form"

type ServiceCreationDrawerProps = {
    onServiceCreated?: (customer: ServicesEntity) => void
}

export default function ServiceCreationDrawer({ onServiceCreated }: ServiceCreationDrawerProps) {
    const drawerCloserBtn = useRef<HTMLButtonElement>(null)

    const { createService, isCreating, isSuccess } = useCreateService()

    if(isSuccess){
        drawerCloserBtn.current?.click()
    }

    const onSubmit = async (values: z.infer<typeof ServiceFormSchema>) => {
        const newService = await createService(values)
        if (onServiceCreated) onServiceCreated(newService.details)
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant='ghost' className="p-0">
                    <Plus className="grow-0 text-blue-600" size={24} />
                </Button>
            </DrawerTrigger>
            <DrawerPortal>
                <DrawerOverlay className="fixed inset-0 bg-black/[0.5]" />
                <DrawerContent>
                    <div className="mx-auto w-full space-y-6 px-4 mt-4 mb-10">
                        <DrawerTitle className="text-center">Creér un nouveau service</DrawerTitle>
                        <div className="w-full">
                            <GenericForm
                                schema={ServiceFormSchema}
                                onSubmit={onSubmit}
                                defaultValues={{
                                    label: '',
                                    price: 0,
                                    description: ''
                                }}
                                fields={[
                                    { name: "label", label: "Titre", type: "text", errorMessage: "Le titre est requis." },
                                    { name: "price", label: "Prix du service", type: "text", errorMessage: "Le prix est requis." },
                                    { name: "description", label: "Description", type: "textarea", placeholder:"décrivez brievement ce service", inputStyle:"border border-gray-400" },
                                ]}
                                isPending={isCreating}
                                submitButton={
                                    <FormButtons isCreating={isCreating}  drawerCloserBtn={drawerCloserBtn} />
                                }
                            />
                            
                        </div>
                    </div>
                </DrawerContent>
            </DrawerPortal>
        </Drawer >
    )
}

type FormButtonsProps = {
    isCreating: boolean,
    drawerCloserBtn: RefObject<HTMLButtonElement>
}

const FormButtons = ({isCreating, drawerCloserBtn}: FormButtonsProps) => {
    return(
        <div className="w-full">
            <Button disabled={isCreating} className="mt-8 text-md py-5 w-full" type="submit">
                Enregister
                {isCreating && <Loader size={18} className="animate-spin ml-3" />}
            </Button>
            <DrawerClose ref={drawerCloserBtn} asChild className="w-full flex mt-4">
                <Button disabled={isCreating} variant="outline">Annuler</Button>
            </DrawerClose>
        </div>
    )
}