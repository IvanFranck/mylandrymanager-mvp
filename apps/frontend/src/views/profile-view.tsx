import { LogOut, Phone, Building2, MapPin, User, Settings } from "lucide-react"
import UserProfileSkeleton from '../components/app/profile/user-profile-skeleton';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/hooks/use-cases/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

export function ProfileView() {
    const { user, selectedAgency, logout } = useAuth();
    const navigate = useNavigate();

    const agencyMemberships = useMemo(
        () => user?.agencyMemberships || [],
        [user]
    );

    if (!user) return <UserProfileSkeleton/>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="space-y-6">
                {/* En-tête du profil */}
                <Card>
                    <CardHeader className="text-center pb-2">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                            <User className="w-12 h-12 text-purple-600" />
                        </div>
                        <CardTitle className="text-2xl font-semibold">{user.username}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button
                            onClick={() => navigate('/profile/edit')}
                            variant="outline"
                            className="gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            Modifier le profil
                        </Button>
                    </CardContent>
                </Card>

                {/* Informations de l'utilisateur */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Informations personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{user.phone}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Informations de l'agence */}
                {selectedAgency && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Agence actuelle</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Building2 className="w-4 h-4" />
                                <span className="font-medium">{selectedAgency.name}</span>
                            </div>
                            {selectedAgency.address && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{selectedAgency.address}</span>
                                </div>
                            )}
                            {
                                agencyMemberships.length > 1 &&
                                <Button
                                    onClick={() => navigate('/select-agency')}
                                    variant="outline"
                                    className="w-full gap-2"
                                >
                                    <Building2 className="w-4 h-4" />
                                    Changer d'agence
                                </Button>
                            } 
                        </CardContent>
                    </Card>
                )}

                {/* Bouton de déconnexion */}
                <Button
                    onClick={logout}
                    className="w-full gap-2 bg-red-100 text-red-600 font-normal py-4 focus:bg-red-200 focus:text-red-700"
                >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                </Button>
            </div>
        </div>
    );
}