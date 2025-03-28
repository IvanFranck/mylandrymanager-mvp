import UserProfileSkeleton from "@/components/app/profile/user-profile-skeleton";
import { Button } from "@/components/ui/button";
import { GenericForm } from "@/components/ui/generic-form";
import { ProfileFormSchema } from "@/lib/api/profile";
import { useUpdateUser } from "@/lib/hooks/use-cases/profile/useUpdateUser";
import { useAuth } from "@/lib/hooks/use-cases/useAuth";
import { Loader } from "lucide-react";
import z from "zod";

export default function ProfileEditView() {
    const userProfile = useAuth().user;

    const { updateUser, isUserUpdating } = useUpdateUser();
    const onSubmit = async (values: z.infer<typeof ProfileFormSchema>) => {
        await updateUser(values);
    }

    return (
        <div className="px-3">
        {
            !userProfile ? <UserProfileSkeleton/> : 
            (
                <>
                    <div className="w-full mt-8 flex flex-col gap-8 bg-white rounded-2xl p-4 shadow-lg">
                        <GenericForm
                            schema={ProfileFormSchema}
                            onSubmit={onSubmit}
                            defaultValues={{
                                username: userProfile?.username,
                                phone: `${userProfile?.phone}`
                            }}
                            fields={[
                                { 
                                    name: "username", 
                                    label: "Nom d'utilisateur", 
                                    type: "text", 
                                    errorMessage: "Le nom d'utilisateur est requis.", 
                                    inputStyle:"shadow-none focus-visible:ring-0 focus-visible:border-black text-lg font-semibold", 
                                    labelStyle: "text-gray-600"
                                },
                                { 
                                    name: "phone", 
                                    label: "Numéro de téléphone",
                                    type: "text", 
                                    errorMessage: "Le numéro de téléphone est requis.", 
                                    inputStyle:"shadow-none focus-visible:ring-0 focus-visible:border-black text-lg font-semibold", 
                                    labelStyle: "text-gray-600"
                                },
                            ]}
                            submitButton={
                                <FormButtons isPending={isUserUpdating} />
                            }
                        />
                        
                    </div>
                </>
            )
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
            <Button disabled={isPending} className="text-md py-5 w-full bg-purple-700" type="submit">
                Valider
                {isPending && <Loader size={18} className="animate-spin ml-3" />}
            </Button>
        </div>
    )
}