import { AuthContext } from "@/components/app/providers/auth-provider";
import { useContext } from "react";


export const useAuth = () => {
    return useContext(AuthContext);
};
