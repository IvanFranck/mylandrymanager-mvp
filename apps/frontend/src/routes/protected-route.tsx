import { useAuth } from "@/lib/hooks/use-cases/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
    const { user, selectedAgency } = useAuth()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!selectedAgency) {
        return <Navigate to="/select-agency" replace />
    }

    return <Outlet />
}