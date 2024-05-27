import { CUSTOMERS_QUERY_KEY } from "@/common/constants/query-keys";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CustomerFormSchema, createCustomerQuery } from "@/lib/api/customers";
import { CustomersEntity } from "@/lib/types/entities";
import { TGenericAxiosError, TGenericResponse } from "@/lib/types/responses";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader, Plus } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type CustomerCreationDrawerProps = {
    onCustomerCreated: (customer: CustomersEntity) => void
}

export default function CustomerCreationDrawer({ onCustomerCreated }: CustomerCreationDrawerProps) {

    const { toast } = useToast()
    const queryClient = useQueryClient()
    const drawerCloserBtn = useRef(null)

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
            queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY })
            toast({
                description: data.message,
                duration: 3000
            })
            drawerCloserBtn.current.click()
        }
    })
    const form = useForm<z.infer<typeof CustomerFormSchema>>({
        resolver: zodResolver(CustomerFormSchema),
        defaultValues: {
            name: '',
            phone: 0,
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
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="w-full flex flex-col space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-500">Nom</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={isCreating} className="border border-gray-400" placeholder="Nom du client" {...field} />
                                                    </FormControl>
                                                    {
                                                        form.formState.errors.name && <FormDescription className="text-red-500">Ce champ est obligatoire</FormDescription>
                                                    }
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-500">Téléphone</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={isCreating} className="border border-gray-400" placeholder="677889922" {...field} />
                                                    </FormControl>
                                                    {
                                                        form.formState.errors.phone && <FormDescription className="text-red-500">Numéro de téléphone obligatoire ou invalide</FormDescription>
                                                    }
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-500">Adresse</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={isCreating} className="border border-gray-400" placeholder="Adresse du client" {...field} />
                                                    </FormControl>
                                                    {
                                                        form.formState.errors.address && <FormDescription className="text-red-500">Ce champ est obligatoire</FormDescription>
                                                    }
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button disabled={isCreating} className="mt-8 text-md py-5 w-full" type="submit">
                                        Enregitrer
                                        {isCreating && <Loader size={18} className="animate-spin ml-3" />}
                                    </Button>
                                    <DrawerClose ref={drawerCloserBtn} asChild className="w-full flex mt-4">
                                        <Button variant="outline">Annuler</Button>
                                    </DrawerClose>
                                </form>
                            </Form>

                        </div>
                    </div>
                </DrawerContent>
            </DrawerPortal>
        </Drawer >
    )
}