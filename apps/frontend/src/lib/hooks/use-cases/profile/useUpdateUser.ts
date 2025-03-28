import { useToast } from "@/components/ui/use-toast";
import { editUserQuery, ProfileFormSchema } from "@/lib/api/profile";
import { UserEntity } from "@/lib/types/entities";
import { TGenericAxiosError } from "@/lib/types/responses";
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { z } from "zod";
import { useAuth } from "../useAuth";

export const useUpdateUser = () => {
    const { toast } = useToast();
    const auth = useAuth();
    
    const { mutateAsync: updateUser, isPending: isUserUpdating } = useMutation({
        mutationFn: async (data: z.infer<typeof ProfileFormSchema>) => {
            return await editUserQuery(data);
        },
        onError: (error: AxiosError<TGenericAxiosError>) => {
            console.log("🚀 ~ update user ~ error:", error)
            const message = error.response?.data?.message || 'Une erreur est survenue lors de la modification de votre profil'
            toast({
                variant: 'destructive',
                description: message,
            })
        },
        onSuccess: (response: UserEntity) => {
            auth.setUser(response)
            toast({
                variant: "success",
                description: 'Votre profil a été modifié avec succès',
            })
        }
    })

    return {
        updateUser,
        isUserUpdating
    }
}