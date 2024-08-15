import { UserEntity } from "./entities"

export type TGenericResponseMetaData= {
    total?: number;
    lastPage?: number;
    currentPage?: number;
    perPage?: number;
    prev?: string;
    next?: string;
  }
export type TGenericResponse<T>  = {
    message: string
    details: T,
    meta?: TGenericResponseMetaData
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
