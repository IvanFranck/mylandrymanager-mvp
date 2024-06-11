import { z } from "zod";
import { RegisterFormSchema } from "@/lib/api/auth";
import { Link } from "react-router-dom";
import { GenericForm } from "@/components/ui/generic-form";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useRegisterNewAccount } from "@/lib/hooks/use-cases/useRegisterNewAccount";

export default function RegisterView() {
    const { registerNewAccount, isRegistering } = useRegisterNewAccount();

    async function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
        await registerNewAccount(values);
    }

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-black text-white">
            <div className="flex flex-col w-full px-5">
                <h1 className="text-4xl font-medium">Créer un compte.</h1>
                <div className="mt-8">
                    <GenericForm
                        schema={RegisterFormSchema}
                        defaultValues={{ username: "", password: "", phone: "", address: "" }}
                        onSubmit={onSubmit}
                        fields={[
                            { name: "username", label: "Nom de la structure", placeholder:'Mon pressing', type: "text", errorMessage: "Le nom d'utilisateur est requis." },
                            { name: "address", label: "Adresse", type: "text", errorMessage: "L'adresse est requise." },
                            { name: "phone", label: "Numéro de téléphone", placeholder:'Votre numéro de téléphone', type: "tel", errorMessage: "Le numéro de téléphone est requis/invalide." },
                            { name: "password", label: "Mot de passe", type: "password", errorMessage: "Le mot de passe est requis." },
                        ]}
                        isPending={isRegistering}
                        submitButton={<SubmitButton isPending={isRegistering} />}
                    />
                    <p className="text-md text-center mt-4">Vous avez déjà un compte ? <Link className="text-blue-500" to="/">Connectez-vous!</Link></p>
                </div>
            </div>
        </div>
    );
}

const SubmitButton = ({ isPending }: { isPending: boolean }) => {
    return (
        <div className="mt-20 w-full">
            <Button disabled={isPending} className=" bg-white w-full text-black rounded-lg text-lg py-5" type="submit">
                Créer un compte
                {isPending && <Loader size={18} className="animate-spin ml-3" />}
            </Button>
        </div>
    );
};