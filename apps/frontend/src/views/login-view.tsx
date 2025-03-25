import { z } from "zod"
import { LoginFormSchema } from "@/lib/api/auth"
import { GenericForm } from "@/components/ui/generic-form"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { useLogin } from "@/lib/hooks/use-cases/useLogin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


export default function LoginView() {
    
    const { mutateAsync, isPending } = useLogin()
    async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
        await mutateAsync(values)
    }
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-medium">
                        Bon retour! Connectez vous à votre compte.
                    </CardTitle>
                    <CardDescription>
                        Connectez vous avezc votre numéro de téléphone et votre mot de passe.
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                En cliquant sur "Se connecter", vous acceptez nos <a href="https://laundry-manager.nzimaivan.com/terms" target="_blank" rel="noopener noreferrer">conditions d'utilisation</a>{" "}
                et notre <a href="https://laundry-manager.nzimaivan.com/privacy-policy" target="_blank" rel="noopener noreferrer">politique de confidentialité</a>.
            </div>
            </div>
        </div>
    )
}

const SubmitButton = ({isPending}: {isPending: boolean}) => {
    return (
        <div className="mt-12 w-full">
            <Button disabled={isPending} className="w-full text-white rounded-lg font-normal py-5" type="submit">
                Se connecter
                {isPending && <Loader size={18} className="animate-spin ml-3" />}
            </Button>
        </div>
    )
}