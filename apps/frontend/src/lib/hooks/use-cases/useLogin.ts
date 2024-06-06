import { useMutation } from "@tanstack/react-query";
import { LoginFormSchema, loginQuery } from "../../api/auth";
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import { LOGIN_QUERY_KEY } from "@/common/constants/query-keys";
import { AxiosError, AxiosResponse } from "axios";
import { TGenericAxiosError, TGenericResponse, TLoginResponseDetails } from "../../types/responses";
import { AXIOS_ACCESS_TOKEN, AXIOS_REFRESH_TOKEN, STORED_USER_DATA } from "@/common/constants/local-storage-keys";

export const useLogin = () => {
    const { toast } = useToast()
    const navigate = useNavigate()
    const auth = useAuth()
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
            auth?.login(authDetails.user)
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

    return {
        mutateAsync,
        isPending
    }
};

