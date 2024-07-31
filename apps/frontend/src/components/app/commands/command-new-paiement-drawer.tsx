import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { GenericForm } from "@/components/ui/generic-form"
import { CommandPaienmentSchema } from "@/lib/api/commands"
import { useUpdateCommand } from "@/lib/hooks/use-cases/commands/useUpdateCommand"
import { BadgeInfo, Loader } from "lucide-react"
import { ReactNode, RefObject, useEffect, useRef } from "react"
import { z } from "zod"

type CommandNewPaiementDrawerProps = {
    commandId: number
    rest: number
    children: ReactNode
}

export const CommandNewPaiementDrawer = ({rest, commandId, children, ...props}: CommandNewPaiementDrawerProps & React.HTMLProps<HTMLDivElement>) => {
    const {isPending, mutateAsync, isSuccess} = useUpdateCommand({commandId})
    const drawerClose = useRef<HTMLButtonElement>(null)
    useEffect(()=>{
        if(isSuccess){
            drawerClose.current?.click()
        }
    }, [isSuccess])

    async function onSubmit(values: z.infer<typeof CommandPaienmentSchema>) {
        await mutateAsync(values)
    }
    return (
        <Drawer>
            <DrawerTrigger className={`${props.className}`} >
                {children}
            </DrawerTrigger>

            <DrawerPortal>
                <DrawerOverlay className="fixed inset-0 bg-black/[0.5]"/>
                <DrawerContent>
                    <div className="mx-auto w-full space-y-6 px-4 mt-4 mb-10">
                        <DrawerTitle className="text-center font-normal leading-8">
                            Définissez les infos de paiement
                        </DrawerTitle>
                        <div className="w-full text-gray-500 flex items-center gap-2 text-sm font-light mt-4">
                            <BadgeInfo size={12}/> 
                            <p className="text-center text-sm font-light">Reste à payer: <span className="">{rest} Fcfa</span></p>
                        </div>
                        <div className="mt-8">
                            <GenericForm
                                schema={CommandPaienmentSchema}
                                onSubmit={onSubmit}
                                defaultValues={{ advance: 0 }}
                                fields={[
                                    {name: "advance", label: "Montant versé", type: "number"},
                                ]}
                                isPending={isPending}
                                submitButton={<SubmitButton isPending={isPending} drawerClose={drawerClose} />}
                            />
                        </div>
                    </div>
                </DrawerContent>
            </DrawerPortal>
        </Drawer>
    )
}

const SubmitButton = ({isPending, drawerClose}: {isPending: boolean, drawerClose: RefObject<HTMLButtonElement>}) => {
    return (
        <DrawerFooter className="mt-8 w-full p-0">
            <Button disabled={isPending} className="bg-blue-500 w-full text-white rounded-lg text-lg py-5" type="submit">
                Enregistrer
                {isPending && <Loader size={18} className="animate-spin ml-3" />}
            </Button>
            <DrawerClose className="hidden" ref={drawerClose}/>
        </DrawerFooter>
    )
}