import { useAuth } from "@/lib/hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
    const auth = useAuth();
    const user = auth?.user;

    if (!user) {
        return <Navigate to='/' replace/>
    }

    return <Outlet/>
}