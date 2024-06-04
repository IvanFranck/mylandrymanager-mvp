import { z } from "zod"
import { LoginFormSchema } from "@/lib/api/auth"
import { Link } from "react-router-dom"
import { GenericForm } from "@/components/ui/generic-form"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { useLogin } from "@/lib/hooks/useLogin"


export default function LoginView() {
    
    const { mutateAsync, isPending } = useLogin()
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