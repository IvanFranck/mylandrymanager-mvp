import { useGetUserProfileInfos } from "@/lib/hooks/use-cases/profile/useGetUserProfileInfos"
import { LogOut, MapPin, Phone } from "lucide-react"
import UserProfileSkeleton from '../components/app/profile/user-profile-skeleton';
import { useNavigate } from "react-router-dom";

export function ProfileView() {
    const {userProfile, isFetching} = useGetUserProfileInfos();
    const navigate = useNavigate();

    return (
        <div className="px-3">
        {
            isFetching ? <UserProfileSkeleton/> : 
            (
                <>
                    <div className="w-full text-center mt-8">
                        <p className="text-base font-thin text-gray-400">Nom du pressing</p>
                        <h1 className="text-2xl font-semibold">{userProfile?.username}</h1>

                        <div className="mt-4">
                            <button
                                onClick={() => navigate('/profile/edit')}
                                className="py-2 px-6 bg-purple-700 text-white tracking-wider rounded-2xl font-light"
                            >
                                Modifier
                            </button>
                        </div>
                    </div>

                    <div className="w-full mt-8 flex flex-col gap-8 bg-white rounded-2xl p-4 shadow-lg">
                        <div className="flex flex-col">
                            <p className="text-base font-thin text-gray-500 flex justify-center items-center w-max">
                                <MapPin className="mr-2 w-4 h-5" /> 
                                <span>Adresse</span>
                            </p>
                            <p className="text-lg font-semibold">{userProfile?.address}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-base font-thin text-gray-500 flex justify-center items-center w-max">
                                <Phone className="mr-2 w-4 h-4" /> 
                                <span>Téléphone</span>
                            </p>
                            <p className="text-lg font-semibold">{userProfile?.phone}</p>
                        </div>
                    </div>

                    <div className="w-full mt-8 flex flex-col gap-8 bg-white rounded-2xl p-4">
                        <p className="text-base text-red-500 flex justify-center items-center w-max">
                            <LogOut className="mr-2 w-4 h-5" /> 
                            <span>Se déconnecter</span>
                        </p>
                    </div>
                </>
            )
        }
        </div>
        
    )
}