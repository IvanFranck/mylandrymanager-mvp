import { SERVICES_QUERY_KEY, SERVICE_ID_QUERY_KEY } from "@/common/constants/query-keys"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ServiceFormSchema, editService, fetchServiceById } from "@/lib/api/services"
import { ServicesEntity } from "@/lib/types/entities"
import { TGenericAxiosError } from "@/lib/types/responses"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Loader } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import z from "zod"

export default function ServiceEditView() {
    const { serviceId } = useParams()
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (data: z.infer<typeof ServiceFormSchema>) => await editService(data, +serviceId),
        onError: (error: AxiosError<TGenericAxiosError>) => {
            console.log("🚀 ~ ServiceEditView ~ error:", error)
            const message = error.response?.data?.message || 'Une erreur est survenue lors de la modification du service'
            toast({
                variant: 'destructive',
                description: message,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SERVICE_ID_QUERY_KEY(+serviceId) })
            queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY })
            toast({
                description: 'Service modifié avec succes',
            })
            // navigate('/services')
        }
    })

    const { data: serviceData, isLoading: isServiceLoading } = useQuery({
        queryKey: SERVICE_ID_QUERY_KEY(+serviceId),
        queryFn: () => fetchServiceById(+serviceId),
        staleTime: 12000,
        placeholderData: () => {
            const service: ServicesEntity[] | undefined = queryClient.getQueryData(SERVICES_QUERY_KEY)
            return service?.find(service => service.id === +serviceId)
        }
    })

    const form = useForm<z.infer<typeof ServiceFormSchema>>({
        resolver: zodResolver(ServiceFormSchema),
        defaultValues: {
            label: serviceData?.label || '',
            price: serviceData?.price || 0,
            description: serviceData?.description || ''
        }
    })

    useEffect(() => {
        if (serviceData) {
            form.reset({
                label: serviceData.label,
                price: serviceData.price,
                description: serviceData.description ? serviceData.description : ''
            })
        }
    }, [serviceData, form])

    const onSubmit = async (values: z.infer<typeof ServiceFormSchema>) => {
        console.log("🚀 ~ onSubmit ~ values:", values)
        await mutateAsync(values)
    }


    return (
        <div className="w-full px-2">
            {
                isServiceLoading ? <p> loading ...</p> : (
                    <div className="w-full mt-8 space-y-4">
                        <h2 className="font-medium text-lg">Modifier le service <span className="italic">"{serviceData?.label}"</span></h2>
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
                                    Valider
                                    {isPending && <Loader size={18} className="animate-spin ml-3" />}
                                </Button>
                            </form>
                        </Form>
                    </div>
                )
            }
        </div>
    )
}
