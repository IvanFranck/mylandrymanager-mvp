import { API_ROUTES } from "@/common/constants/api-routes";
import { axiosInstance } from "../plugins/axios";
import { AxiosResponse } from "axios";
import { TGenericResponse } from "../types/responses";
import { CustomersEntity } from "../types/entities";
import z from "zod";
import { GenericQueryType } from "../types/query.filter.types";
import { formatRequestQuery } from "../utils";

export const CustomerFormSchema = z.object({
    name: z.string().trim().min(1, 'invalid name'),
    phone: z.string().min(9).max(9, 'invalid phone number'),
    address: z.string().trim().optional(),
    agencyId: z.number(),
    agreeWithMessagingPolicy: z.boolean()
})

export async function fetchLatestCustomersQuery(query: GenericQueryType) {
    const queryString = formatRequestQuery(query)
    return await axiosInstance
                    .get(`${API_ROUTES.CUSTOMERS}${queryString}`)
                    .then((resp: AxiosResponse<TGenericResponse<CustomersEntity[]>>) => resp.data)
}

export async function searchCustomerByName(text: string) {
    return await axiosInstance
                    .get(`${API_ROUTES.CUSTOMERS}/search?name=${text}`)
                    .then((resp: AxiosResponse<TGenericResponse<CustomersEntity[]>>) => resp.data)
}

export async function createCustomerQuery(data: z.infer<typeof CustomerFormSchema>){
    return await axiosInstance
                    .post(`${API_ROUTES.CUSTOMERS}`, data)
                    .then((resp: AxiosResponse<TGenericResponse<CustomersEntity>>) => resp.data)
}