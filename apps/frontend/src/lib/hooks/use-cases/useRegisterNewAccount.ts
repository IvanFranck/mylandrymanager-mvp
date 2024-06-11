import { useMutation } from "@tanstack/react-query";
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { REGISTER_QUERY_KEY } from "@/common/constants/query-keys";
import { RegisterFormSchema, registerQuery } from "@/lib/api/auth";
import { TGenericAxiosError } from "@/lib/types/responses";
import { AxiosError } from "axios";

export const useRegisterNewAccount = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const queryKey = REGISTER_QUERY_KEY;
    const { mutateAsync: registerNewAccount, isPending: isRegistering } = useMutation({
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

    return {
        registerNewAccount,
        isRegistering
    }
}

