import { z } from "zod"
import { LoginFormSchema, loginQuery } from "@/lib/api/auth"
import { useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"
import { useToast } from "@/components/ui/use-toast"
import { Link, useNavigate } from "react-router-dom"
import { TGenericAxiosError, TGenericResponse, TLoginResponseDetails } from "@/lib/types/responses"
import { AXIOS_ACCESS_TOKEN, AXIOS_REFRESH_TOKEN, STORED_USER_DATA } from "@/common/constants/local-storage-keys"
import { GenericForm } from "@/components/ui/generic-form"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { LOGIN_QUERY_KEY } from "@/common/constants/query-keys"


export default function LoginView() {
    const { toast } = useToast()
    const navigate = useNavigate()
    const queryKey = LOGIN_QUERY_KEY
    const { mutateAsync, isPending } = useMutation({
        mutationKey: queryKey,
        mutationFn: async (data: z.infer<typeof LoginFormSchema>) => {
            return await loginQuery(data);
        },
        onError: (error: AxiosError<TGenericAxiosError>) => {
            const message = error.response?.data?.message || 'Une erreur est survenue'
            toast({
                variant: 'destructive',
                description: message,
            })
        },
        onSuccess: (data: AxiosResponse<TGenericResponse<TLoginResponseDetails>>) => {
            const authDetails = data.data.details
            localStorage.setItem(AXIOS_ACCESS_TOKEN, authDetails.accessToken)
            localStorage.setItem(AXIOS_REFRESH_TOKEN, authDetails.refreshToken)
            localStorage.setItem(STORED_USER_DATA, JSON.stringify(authDetails.user))
            toast({
                variant: 'success',
                description: 'Vous êtes connecté!'
            })
            navigate('/commands')
        }
    })
    async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
        await mutateAsync(values)
    }
    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-black text-white">
            <div className="flex flex-col w-full px-5">
                <h1 className="text-4xl font-medium">Connectez vous à votre compte.</h1>
                <div className="mt-8">
                    <GenericForm
                        schema={LoginFormSchema}
                        defaultValues={{password: "", phone: ""}}
                        onSubmit={onSubmit}
                        fields={[
                            { name: "phone", label: "Numéro de téléphone", type: "tel", errorMessage: "Le numéro de téléphone est requis/invalide." },
                            { name: "password", label: "Mot de passe", type: "password", errorMessage: "Le mot de passe est requis." }
                        ]}
                        isPending={isPending}
                        submitButton={<SubmitButton isPending={isPending} />}
                    />
                    <p className="text-sm text-center mt-4">Vous n'avez pas de compte ? <Link className="text-blue-500" to="/register">Créer en un</Link></p>
                </div>
            </div>
        </div>
    )
}

const SubmitButton = ({isPending}: {isPending: boolean}) => {
    return (
        <Button disabled={isPending} className="bg-white text-black rounded-lg text-lg py-5" type="submit">
            Se connecter
            {isPending && <Loader size={18} className="animate-spin ml-3" />}
        </Button>
    )
}