import { AgencyEntity, UserEntity } from "@/lib/types/entities"
import { create } from "zustand"
import { persist } from "zustand/middleware"


interface AuthState {
    user: UserEntity | null
    selectedAgency: AgencyEntity | null
    accessToken: string | null
    refreshToken: string | null
    setUser: (user: UserEntity | null) => void
    selectAgency: (agency: AgencyEntity) => void
    setTokens: (accessToken: string, refreshToken: string) => void
    logout: () => void
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            selectedAgency: null,
            accessToken: null,
            refreshToken: null,
            setUser: (user) => set({ user }),
            selectAgency: (agency) => set({ selectedAgency: agency }),
            setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
            logout: () => set({ user: null, selectedAgency: null, accessToken: null, refreshToken: null }),
        }),
        {
            name: "auth-storage",
        }
    )
) 