import { z } from "zod";
import { RegisterFormSchema, registerQuery } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { TGenericAxiosError } from "@/lib/types/responses";
import { GenericForm } from "@/components/ui/generic-form";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { REGISTER_QUERY_KEY } from "@/common/constants/query-keys";

export default function RegisterView() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const queryKey = REGISTER_QUERY_KEY;
    const { mutateAsync, isPending } = useMutation({
        mutationKey: queryKey,
        mutationFn: async (data: z.infer<typeof RegisterFormSchema>) => {
            return await registerQuery(data);
        },
        onError: (error: AxiosError<TGenericAxiosError>) => {
            const message = error.response?.data?.message || 'Une erreur est survenue';
            toast({
                variant: 'destructive',
                description: message,
            });
        },
        onSuccess: () => {
            toast({
                variant: 'success',
                description: 'Compte créé avec succès!',
            });
            navigate('/');
        }
    });

    async function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
        await mutateAsync(values);
    }

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-black text-white">
            <div className="flex flex-col w-full px-5">
                <h1 className="text-4xl font-medium">Créer un compte.</h1>
                <div className="mt-8">
                    <GenericForm
                        schema={RegisterFormSchema}
                        defaultValues={{ username: "", password: "", phone: "" }}
                        onSubmit={onSubmit}
                        fields={[
                            { name: "username", label: "Nom de la structure", placeholder:'Mon pressing', type: "text", errorMessage: "Le nom d'utilisateur est requis." },
                            { name: "phone", label: "Numéro de téléphone", placeholder:'Votre numéro de téléphone', type: "tel", errorMessage: "Le numéro de téléphone est requis/invalide." },
                            { name: "password", label: "Mot de passe", type: "password", errorMessage: "Le mot de passe est requis." }
                        ]}
                        isPending={isPending}
                        submitButton={<SubmitButton isPending={isPending} />}
                    />
                    <p className="text-sm text-center mt-4">Vous avez déjà un compte ? <Link className="text-blue-500" to="/">Connectez-vous!</Link></p>
                </div>
            </div>
        </div>
    );
}

const SubmitButton = ({ isPending }: { isPending: boolean }) => {
    return (
        <Button disabled={isPending} className="bg-white text-black rounded-lg text-lg py-5" type="submit">
            Créer un compte
            {isPending && <Loader size={18} className="animate-spin ml-3" />}
        </Button>
    );
};