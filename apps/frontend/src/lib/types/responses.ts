import { UserEntity } from "./entities"

export type TGenericResponse<T>  = {
    message: string
    details: T
}
export type TGenericAxiosError = {
    message: string
    status: number,
    error: string,
    path: string,
    timestamp: string
}

export type TLoginResponseDetails = {
    accessToken: string
    refreshToken: string
    user: Omit<UserEntity, 'password'>
}
