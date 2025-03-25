import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Agency {
    address: string,
    name: string
}
interface User {
    id: number
    username: string
    phone: string
    agencyMemberships: {
        agencyId: number
        agency: Agency
    }[]
}

interface AuthState {
    user: User | null
    selectedAgency: Agency | null
    setUser: (user: User | null) => void
    selectAgency: (agency: Agency) => void
    logout: () => void
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            selectedAgency: null,
            setUser: (user) => set({ user }),
            selectAgency: (agency) => set({ selectedAgency: agency }),
            logout: () => set({ user: null, selectedAgency: null }),
        }),
        {
            name: "auth-storage",
        }
    )
) 