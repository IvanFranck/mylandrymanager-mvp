import { API_ROUTES } from "@/common/constants/api-routes";
import { z } from "zod";
import { axiosInstance } from "../plugins/axios";
import { AxiosResponse } from "axios";
import { TGenericResponse } from "../types/responses";
import { CommandsEntity } from "../types/entities";
import { formatISO } from "date-fns";

export const CommandSchema = z.object({
    description: z.string().optional(),
    discount: z.number().optional(),
    customerId: z.number(),
    withdrawDate: z.date().transform(date => formatISO(date)),
    services: z.array(z.object({
        service: z.object({
            id: z.number(),
            createdAt: z.date(),
            updatedAt: z.date(),
            label: z.string(),
            price: z.number(),
            description: z.string().optional(),
            userId: z.number()
        }),
        quantity: z.number()
    }))
})

export async function createCommandQuery(data: z.infer<typeof CommandSchema>){
    return await axiosInstance
                    .post(`${API_ROUTES.COMMANDS}`, data)
                    .then((resp: AxiosResponse<TGenericResponse<CommandsEntity>>) => resp.data)
}

export async function fetchAllCommandsQuery(){
    return await axiosInstance
                    .get(API_ROUTES.COMMANDS)
                    .then((resp: AxiosResponse<TGenericResponse<CommandsEntity[]>>) => resp.data.details)
}

export async function fetchCommandById(id: number) {
    return await axiosInstance
                .get(`${API_ROUTES.COMMANDS}/${id}`)
                .then((resp: AxiosResponse<TGenericResponse<CommandsEntity>>) => {
                    return resp.data.details
                })
}