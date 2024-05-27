import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerOverlay, DrawerPortal, DrawerTrigger, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader } from "lucide-react"
import { ServiceFormSchema, createService } from "@/lib/api/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { AxiosError } from "axios"
import { TGenericAxiosError, TGenericResponse } from "@/lib/types/responses"
import z from "zod"
import { Plus } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SERVICES_QUERY_KEY } from "@/common/constants/query-keys"
import { ServicesEntity } from "@/lib/types/entities"
import { useRef } from "react"

export default function ServiceCreationDrawer() {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const drawerCloserBtn = useRef(null)

    const { mutateAsync, isPending } = useMutation({
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
            queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY })
            toast({
                description: data.message,
                duration: 3000
            })
            drawerCloserBtn.current.click()
        }
    })
    const form = useForm<z.infer<typeof ServiceFormSchema>>({
        resolver: zodResolver(ServiceFormSchema),
        defaultValues: {
            label: '',
            price: 0,
            description: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof ServiceFormSchema>) => {
        console.log("🚀 ~ onSubmit ~ values:", values)
        await mutateAsync(values)
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
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="w-full flex flex-col space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="label"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-500">Titre</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={isPending} className="border border-gray-400" placeholder="Nom du service" {...field} />
                                                    </FormControl>
                                                    {
                                                        form.formState.errors.label && <FormDescription className="text-red-500">Ce champ est obligatoire</FormDescription>
                                                    }
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-500">Prix du service</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" disabled={isPending} className="border border-gray-400" {...field} />
                                                    </FormControl>
                                                    {
                                                        form.formState.errors.price && <FormDescription className="text-red-500">Ce champ est obligatoire</FormDescription>
                                                    }

                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-500">Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea disabled={isPending} className="border border-gray-400" placeholder="décrivez brievement ce service" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button disabled={isPending} className="mt-8 text-md py-5 w-full" type="submit">
                                        Enregister
                                        {isPending && <Loader size={18} className="animate-spin ml-3" />}
                                    </Button>
                                    <DrawerClose ref={drawerCloserBtn} asChild className="w-full flex mt-4">
                                        <Button disabled={isPending} variant="outline">Annuler</Button>
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