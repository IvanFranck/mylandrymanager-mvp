import { Button } from "@/components/ui/button"
import { GenericForm } from "@/components/ui/generic-form"
import { ServiceEditFormSchema } from "@/lib/api/services"
import { useGetServiceById } from "@/lib/hooks/use-cases/services/useGetServiceById"
import { useUpdateService } from "@/lib/hooks/use-cases/services/useUpdateService"
import { useAuth } from "@/lib/hooks/use-cases/useAuth"
import { Loader } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import z from "zod"

export default function ServiceEditView() {
    const { serviceId } = useParams<{ serviceId: string }>()
    const numericServiceId = Number(serviceId) || 0; // Fallback to 0 if ServiceId is undefined or not a number
    const agencyId = useAuth.getState().selectedAgency?.id
    const navigate = useNavigate()

    const {isServiceUpdating, updateService} = useUpdateService({serviceId: numericServiceId, query: {agencyId}})
    const {isServiceLoading, service: serviceData} = useGetServiceById({serviceId: numericServiceId, query: {agencyId}})

    const onSubmit = async (values: z.infer<typeof ServiceEditFormSchema>) => {
        await updateService(values)
    }


    return (
        <div className="w-full flex-1 rounded-t-3xl px-2 bg-white">
            {
                isServiceLoading ? <p className="p6"> Chargement ...</p> : 
                serviceData 
                    ? (
                        <div className="w-full px-4 mt-8 space-y-4">
                            <h2 className="font-medium text-lg">Modifier le service <span className="italic">"{serviceData.currentVersion.label}"</span></h2>

                            <GenericForm
                                schema={ServiceEditFormSchema}
                                onSubmit={onSubmit}
                                defaultValues={{
                                    label: serviceData.currentVersion.label,
                                    price: Number(serviceData.currentVersion.price),
                                    description: serviceData.currentVersion.description
                                }}
                                fields={[
                                    { name: "label", label: "Titre", type: "text", errorMessage: "Le titre est requis." },
                                    { name: "price", label: "Prix du service", type: "text", errorMessage: "Le prix est requis." },
                                    { name: "description", label: "Description", type: "textarea", placeholder:"décrivez brievement ce service", inputStyle:"border border-gray-400" },
                                ]}
                                isPending={isServiceUpdating}
                                submitButton={
                                    <FormButtons isPending={isServiceUpdating} />
                                }
                            />
                            <Button onClick={()=>navigate('/services')} disabled={isServiceUpdating} className="text-md py-5 w-full" variant="ghost">
                                Annuler
                                {isServiceUpdating && <Loader size={18} className="animate-spin ml-3" />}
                            </Button>
                        </div>
                    )
                    : <p>No data</p>
            }
        </div>
    )
}

type FormButtonsProps = {
    isPending: boolean,
}

const FormButtons = ({isPending}: FormButtonsProps) => {
    return(
        <div className="w-full mt-8">
            <Button disabled={isPending} className="text-md py-5 w-full" type="submit">
                Valider
                {isPending && <Loader size={18} className="animate-spin ml-3" />}
            </Button>
        </div>
    )
}