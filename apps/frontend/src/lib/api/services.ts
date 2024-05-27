import { API_ROUTES } from "@/common/constants/api-routes";
import { axiosInstance } from "../plugins/axios";
import { AxiosResponse } from "axios";
import { TGenericResponse } from "../types/responses";
import { ServicesEntity } from "../types/entities";
import z from "zod";

export const ServiceFormSchema = z.object({
    label: z.string().trim().min(1, 'invalid label'),
    price: z.string().trim().min(1, 'invalid price').transform((price: string):number => +price),
    description: z.string().trim().optional()
})

export async function fetchAllServicesQuery() {
    return await axiosInstance
                .get(API_ROUTES.SERVICES)
                .then((resp: AxiosResponse<TGenericResponse<ServicesEntity[]>>) => {
                    return resp.data.details
                })
}

export async function createService(data: z.infer<typeof ServiceFormSchema>){
    return await axiosInstance
                    .post(`${API_ROUTES.SERVICES}`, data)
                    .then((resp: AxiosResponse<TGenericResponse<ServicesEntity>>) => {
                        return resp.data
                    })
}

export async function deleteService(id: number): Promise<TGenericResponse<ServicesEntity>> {
    return await axiosInstance
                    .delete(`${API_ROUTES.SERVICES}/${id}`)
                    .then((resp: AxiosResponse<TGenericResponse<ServicesEntity>>) => {
                        return resp.data
                    })
}

export async function editService(data: z.infer<typeof ServiceFormSchema>, id: number) {
    return await axiosInstance
                    .put(`${API_ROUTES.SERVICES}/${id}`, data)
                    .then((resp: AxiosResponse<TGenericResponse<ServicesEntity>>) => {
                        return resp.data
                    })
}

export async function fetchServiceById(id: number) {
    return await axiosInstance
                .get(`${API_ROUTES.SERVICES}/${id}`)
                .then((resp: AxiosResponse<TGenericResponse<ServicesEntity>>) => {
                    return resp.data.details
                })
}