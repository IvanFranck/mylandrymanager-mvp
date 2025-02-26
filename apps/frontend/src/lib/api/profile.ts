import { API_ROUTES } from "@/common/constants/api-routes"
import { axiosInstance } from "../plugins/axios"
import { AxiosResponse } from "axios"
import { TGenericResponse } from "../types/responses"
import { UserProfileEntity } from "../types/entities"

export async function fetchUserInfosQuery() {
    return await axiosInstance
                .get(API_ROUTES.PROFILE)
                .then((resp: AxiosResponse<TGenericResponse<UserProfileEntity>>) => {
                    return resp.data.details
                })
} 