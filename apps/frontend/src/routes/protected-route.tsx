import { useAuth } from "@/lib/hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
    const auth = useAuth();

    const user = auth?.user;

    console.log('isAuthenticated protected', auth)
    if (!user) {
        return <Navigate to='/' replace/>
    }

    return <Outlet/>
}