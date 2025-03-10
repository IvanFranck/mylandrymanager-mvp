import { API_ROUTES } from "@/common/constants/api-routes"
import { axiosInstance } from "../plugins/axios"
import { AxiosResponse } from "axios"
import { TGenericResponse } from "../types/responses"
import { UserProfileEntity } from "../types/entities"
import z from "zod"

export const ProfileFormSchema = z.object({
    username: z.string().trim().min(1, 'invalid username'),
    address: z.string().trim().min(1, 'invalid address'),
    phone: z.string().trim().min(1, 'invalid phone')
})

export async function fetchUserInfosQuery() {
    return await axiosInstance
                .get(API_ROUTES.PROFILE)
                .then((resp: AxiosResponse<TGenericResponse<UserProfileEntity>>) => {
                    return resp.data.details
                })
} 

export async function editUserQuery(data: z.infer<typeof ProfileFormSchema>) {
    return await axiosInstance
                .patch(API_ROUTES.USER.UPDATE, data)
                .then((resp: AxiosResponse<TGenericResponse<UserProfileEntity>>) => {
                    console.log('resp', resp)
                    return resp.data.details
                })
} 