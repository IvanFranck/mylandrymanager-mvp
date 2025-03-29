import { CUSTOMERS_QUERY_KEY } from "@/common/constants/query-keys";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { GenericForm } from "@/components/ui/generic-form";
import { useToast } from "@/components/ui/use-toast";
import { CustomerFormSchema, createCustomerQuery } from "@/lib/api/customers";
import { useAuth } from "@/lib/hooks/use-cases/useAuth";
import { CustomersEntity } from "@/lib/types/entities";
import { TGenericAxiosError, TGenericResponse } from "@/lib/types/responses";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader, Plus } from "lucide-react";
import { RefObject, useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type CustomerCreationDrawerProps = {
    onCustomerCreated: (customer: CustomersEntity) => void
}

export default function CustomerCreationDrawer({ onCustomerCreated }: CustomerCreationDrawerProps) {

    const { toast } = useToast()
    const queryClient = useQueryClient()
    const drawerCloserBtn = useRef<HTMLButtonElement>(null)
    const agencyId = useAuth.getState().selectedAgency?.id;

    const { mutateAsync: createCustomer, isPending: isCreating } = useMutation({
        mutationFn: async (data: z.infer<typeof CustomerFormSchema>) => await createCustomerQuery(data),
        onError: (error: AxiosError<TGenericAxiosError>) => {
            const message = error.response?.data?.message || 'Une erreur est survenue lors de la création du client'
            toast({
                variant: 'destructive',
                description: message,
                duration: 7000
            })
        },
        onSuccess: (data: TGenericResponse<CustomersEntity>) => {
            queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY({agencyId}) })
            toast({
                variant: 'success',
                description: data.message,
                duration: 3000
            })
            drawerCloserBtn.current?.click()
        }
    })
    const form = useForm<z.infer<typeof CustomerFormSchema>>({
        resolver: zodResolver(CustomerFormSchema),
        defaultValues: {
            name: '',
            phone: '',
            address: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof CustomerFormSchema>) => {
        const newCustomer = await createCustomer(data)
        onCustomerCreated(newCustomer.details)
    }

    const handleClose = () => {
        form.reset()
    }
    return (
        <Drawer onClose={handleClose}>
            <DrawerTrigger asChild>
                <Button className="flex items-center space-x-1" type="submit">
                    <span>Nouveau</span>
                    <Plus size={16} strokeWidth={3} />
                </Button>
            </DrawerTrigger>

            <DrawerPortal>
                <DrawerOverlay className="fixed inset-0 bg-black/[0.5]" />
                <DrawerContent>
                    <div className="mx-auto w-full space-y-6 px-4 mt-4 mb-10">
                        <DrawerTitle className="text-center">Creer un nouveau client</DrawerTitle>
                        <div className="w-full">
                            <GenericForm
                                schema={CustomerFormSchema}
                                onSubmit={onSubmit}
                                defaultValues={
                                    {
                                        name: '',
                                        phone: '',
                                        address: '',
                                        agencyId,
                                        agreeWithMessagingPolicy: false
                                    }
                                }
                                fields={[
                                    {
                                        name: 'name',
                                        label: 'Nom',
                                        type: 'text',
                                        placeholder: 'Nom du client'
                                    },
                                    {
                                        name: 'phone',
                                        label: 'Téléphone',
                                        type: 'tel',
                                        placeholder: '677889922'
                                    },
                                    {
                                        name: 'address',
                                        label: 'Adresse',
                                        type: 'text',
                                        placeholder: 'Adresse du client',       
                                    },
                                    {
                                        name: 'agreeWithMessagingPolicy',
                                        label: 'Accepter la politique de messagerie',
                                        type: 'checkbox',
                                        errorMessage: 'Veuillez accepter la politique de messagerie'
                                    },
                                    {
                                        name: 'agencyId',
                                        type: 'hidden'
                                    }
                                ]}
                                isPending={isCreating}
                                submitButton={
                                    <FormButtons loading={isCreating}  drawerCloserBtn={drawerCloserBtn} />
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
    loading: boolean,
    drawerCloserBtn: RefObject<HTMLButtonElement>
}

const FormButtons = ({ loading, drawerCloserBtn }: FormButtonsProps) => {
    return(
        <div className="w-full">
            <Button disabled={loading} className="mt-8 text-md py-5 w-full" type="submit">
                Enregitrer
                {loading && <Loader size={18} className="animate-spin ml-3" />}
            </Button>
            <DrawerClose ref={drawerCloserBtn} asChild className="w-full flex mt-4">
                <Button variant="outline">Annuler</Button>
            </DrawerClose>
        </div>
    )
}