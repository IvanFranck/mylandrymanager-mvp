import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { LoginFormSchema, loginQuery } from "@/lib/api/auth";
import { z } from "zod"
import { AxiosError } from "axios";
import { TGenericAxiosError } from "@/lib/types/responses";
import { useToast } from "@/components/ui/use-toast";

export function useLogin() {
    const navigate = useNavigate();
    const { setUser, setTokens } = useAuth();
    const { toast } = useToast()

    return useMutation({
        mutationFn: async (data: z.infer<typeof LoginFormSchema>) => {
            const response = await loginQuery(data);
            return response.data;
        },
        onSuccess: (data) => {
            setUser(data.details.user);
            setTokens(data.details.accessToken, data.details.refreshToken);
            navigate("/select-agency");
        },
        onError: (error: AxiosError<TGenericAxiosError>) => {
            const message = error.response?.data?.message || 'Une erreur est survenue'
            toast({
                variant: 'destructive',
                description: message,
            })
        },
    });
}

