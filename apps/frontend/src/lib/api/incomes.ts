import { AxiosResponse } from 'axios';
import { API_ROUTES } from "@/common/constants/api-routes"
import { axiosInstance } from "../plugins/axios"
import { IncomesQueriesType } from "../types/query.filter.types"
import { TGenericResponse } from '../types/responses';
import { IncomesStatsEntity } from '../types/entities';

export async function getIncomesStats(query: IncomesQueriesType){
    const queryString = Object.entries(query).map(([key, value], index)=>{
        return value ? 
            index === 0 ? 
                `?${key}=${value}` 
                : `&${key}=${value}` 
            : ''
    }).join('')
    return await axiosInstance
        .get(`${API_ROUTES.INCOMES}${queryString}`)
        .then((resp: AxiosResponse<TGenericResponse<IncomesStatsEntity[]>>) => resp.data)
}