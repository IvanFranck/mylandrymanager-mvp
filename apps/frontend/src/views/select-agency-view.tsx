import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-cases/useAuth"

export default function SelectAgencyView() {
    const navigate = useNavigate()
    const { user, selectAgency } = useAuth()

    useEffect(() => {
        if (!user) {
            navigate("/login")
            return
        }

        // Si l'utilisateur n'a qu'une seule agence, la sélectionner automatiquement
        if (user.agencyMemberships.length === 1) {
            selectAgency(user.agencyMemberships[0].agency)
            navigate('/commands')
        }
    }, [user, navigate, selectAgency])

    if (!user) return null

    // Si l'utilisateur n'a aucune agence, afficher un message d'erreur
    if (user.agencyMemberships.length === 0) {
        return (
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl font-medium">
                            Aucune agence trouvée
                        </CardTitle>
                        <CardDescription>
                            Vous n'êtes pas membre d'une agence. Veuillez contacter votre administrateur pour être ajouté à une agence.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button variant="outline" onClick={() => navigate("/login")}>
                            Retour à la connexion
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="w-full max-w-2xl">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-medium">
                            Sélectionnez votre agence
                        </CardTitle>
                        <CardDescription>
                            Choisissez l'agence à laquelle vous souhaitez vous connecter
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.agencyMemberships.map((membership) => (
                                <Button
                                    key={membership.agencyId}
                                    variant="outline"
                                    className="h-auto p-6 flex flex-col items-center gap-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                                    onClick={() => {
                                        selectAgency(membership.agency)
                                        navigate("/")
                                    }}
                                >
                                    <Building2 className="h-8 w-8" />
                                    <div className="text-center">
                                        <div className="font-medium">{membership.agency.name}</div>
                                        {membership.agency.address && (
                                            <div className="text-sm text-muted-foreground">
                                                {membership.agency.address}
                                            </div>
                                        )}
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 