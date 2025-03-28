import { API_ROUTES } from "@/common/constants/api-routes";
import { axiosInstance } from "../plugins/axios";
import { AxiosResponse } from "axios";
import { TGenericResponse } from "../types/responses";
import { ServicesEntity } from "../types/entities";
import z from "zod";
import { GenericQueryType } from "../types/query.filter.types";
import { formatRequestQuery } from "../utils";

export const ServiceFormSchema = z.object({
    label: z.string().trim().min(1, 'invalid label'),
    price: z.number().min(1, 'invalid price'),
    description: z.string().trim().optional(),
    agencyId: z.number()
})

export const ServiceEditFormSchema = z.object({
    label: z.string().trim().min(1, 'invalid label'),
    price: z.number().min(1, 'invalid price'),
    description: z.string().trim().optional(),
})

export async function fetchAllServicesQuery(query:GenericQueryType) {
    const queryString = formatRequestQuery(query)
    return await axiosInstance
                .get(`${API_ROUTES.SERVICES}${queryString}`)
                .then((resp: AxiosResponse<TGenericResponse<ServicesEntity[]>>) => {
                    return resp.data.details
                })
}

export async function searchServiceByName(text: string) {
    return await axiosInstance
                    .get(`${API_ROUTES.SERVICES}/search?name=${text}`)
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

export async function editService(data: z.infer<typeof ServiceEditFormSchema>, id: number) {
    return await axiosInstance
                    .put(`${API_ROUTES.SERVICES}/${id}`, data)
                    .then((resp: AxiosResponse<TGenericResponse<ServicesEntity>>) => {
                        return resp.data
                    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchServiceById(id: number, query: GenericQueryType) {
    const queryString = formatRequestQuery(query);
    return await axiosInstance
                .get(`${API_ROUTES.SERVICES}/${id}${queryString}`)
                .then((resp: AxiosResponse<TGenericResponse<ServicesEntity>>) => {
                    return resp.data.details
                })
}