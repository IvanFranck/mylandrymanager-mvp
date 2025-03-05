import UserProfileSkeleton from "@/components/app/profile/user-profile-skeleton";
import { Button } from "@/components/ui/button";
import { GenericForm } from "@/components/ui/generic-form";
import { ProfileFormSchema } from "@/lib/api/profile";
import { useGetUserProfileInfos } from "@/lib/hooks/use-cases/profile/useGetUserProfileInfos";
import { useUpdateUser } from "@/lib/hooks/use-cases/profile/useUpdateUser";
import { Loader } from "lucide-react";
import z from "zod";

export default function ProfileEditView() {
    const {userProfile, isFetching} = useGetUserProfileInfos();

    const { updateUser, isUserUpdating } = useUpdateUser();
    const onSubmit = async (values: z.infer<typeof ProfileFormSchema>) => {
        console.log('values', values);
        await updateUser(values);
    }

    return (
        <div className="px-3">
        {
            isFetching ? <UserProfileSkeleton/> : 
            (
                <>
                    <div className="w-full mt-8 flex flex-col gap-8 bg-white rounded-2xl p-4 shadow-lg">
                        <GenericForm
                            schema={ProfileFormSchema}
                            onSubmit={onSubmit}
                            defaultValues={{
                                username: userProfile?.username,
                                address: userProfile?.address,
                                phone: `${userProfile?.phone}`
                            }}
                            fields={[
                                { 
                                    name: "username", 
                                    label: "Nom d'utilisateur", 
                                    type: "text", 
                                    errorMessage: "Le nom d'utilisateur est requis.", 
                                    inputStyle:"border-0 shadow-none py-0 px-0 focus-visible:ring-0 focus-visible:border-0 text-lg font-semibold", 
                                    labelStyle: "font-thin"
                                },
                                { 
                                    name: "address", 
                                    label: "Adresse", 
                                    type: "text", 
                                    placeholder:"décrivez brievement votre adresse", 
                                    inputStyle:"border-0 shadow-none py-0 px-0 focus-visible:ring-0 focus-visible:border-0 text-lg font-semibold", 
                                    labelStyle: "font-thin" 
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