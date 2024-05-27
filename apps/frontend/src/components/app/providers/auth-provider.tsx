import { STORED_USER_DATA } from '@/common/constants/local-storage-keys';
import { useLocalStorage } from '@/lib/hooks/useLocalstorage';
import { UserEntity } from '@/lib/types/entities';
import { createContext, useCallback, useMemo } from 'react';

export type AuthContextType = {
    user: Omit<UserEntity, 'password'> | null
    login: (data: Omit<UserEntity, 'password'>) => void
    logOut: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [storedUser, setStoredUser] = useLocalStorage<Omit<UserEntity, 'password'> | null>(STORED_USER_DATA, null) as [Omit<UserEntity, 'password'> | null, (newValue: Omit<UserEntity, 'password'> | null) => void]
    const login = useCallback((data: Omit<UserEntity, 'password'>) => {
        setStoredUser(data)
    }, [setStoredUser])

    const logOut = useCallback(() => {
        setStoredUser(null)
    }, [setStoredUser])

    const data = useMemo(
        ()=>({
            user: storedUser,
            login,
            logOut
        }),
        [logOut, login, storedUser]
    )

    return ( 
        <AuthContext.Provider value={data}> 
            {children} 
        </AuthContext.Provider>
    )
}