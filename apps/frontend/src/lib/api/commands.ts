import { API_ROUTES } from "@/common/constants/api-routes";
import { z } from "zod";
import { axiosInstance } from "../plugins/axios";
import { AxiosResponse } from "axios";
import { TGenericResponse } from "../types/responses";
import { CommandsEntity } from "../types/entities";
import { formatISO } from "date-fns";
import { CommandQueriesType } from "../types/query.filter.types";

export const CommandSchema = z.object({
    description: z.string().optional(),
    discount: z.number().optional().default(0),
    advance: z.number().optional().default(0),
    customerId: z.number(),
    withdrawDate: z.date().transform(date => formatISO(date)),
    services: z.array(z.object({
        service: z.object({
            id: z.number(),
            createdAt: z.date(),
            updatedAt: z.date(),
            label: z.string(),
            price: z.number(),
            currentVersionId: z.number(),
            description: z.string().optional(),
        }),
        quantity: z.number()
    }))
})

export const CommandPaienmentSchema = z.object({
    advance: z.string()
            .trim()
            .transform(value => parseFloat(value))
})

export async function createCommandQuery(data: z.infer<typeof CommandSchema>){
    return await axiosInstance
                    .post(`${API_ROUTES.COMMANDS}`, data)
                    .then((resp: AxiosResponse<TGenericResponse<CommandsEntity>>) => resp.data)
}


export async function fetchAllCommandsQuery(query: CommandQueriesType){
    const queryString = Object.entries(query).map(([key, value], index)=>{
        return value ? 
            index === 0 ? 
                `?${key}=${value}` 
                : `&${key}=${value}` 
            : ''
      }).join('')
    return await axiosInstance
                    .get(`${API_ROUTES.COMMANDS}${queryString}`)
                    .then((resp: AxiosResponse<TGenericResponse<CommandsEntity[]>>) => resp.data.details)

}

export async function fetchCommandById(id: number) {
    return await axiosInstance
                .get(`${API_ROUTES.COMMANDS}/${id}`)
                .then((resp: AxiosResponse<TGenericResponse<CommandsEntity>>) => {
                    return resp.data.details
                })
}

export async function updateCommand(commandId: number, data: z.infer<typeof CommandPaienmentSchema>){
    return await axiosInstance
                    .put(`${API_ROUTES.COMMANDS}/${commandId}`, data)
                    .then((resp: AxiosResponse<TGenericResponse<CommandsEntity>>) => {
                        return resp.data
                    })
}