import { AxiosResponse } from 'axios';
import { API_ROUTES } from "@/common/constants/api-routes"
import { axiosInstance } from "../plugins/axios"
import { IncomesQueriesType } from "../types/query.filter.types"
import { TGenericResponse } from '../types/responses';
import { IncomesStatsEntity } from '../types/entities';
import { formatRequestQuery } from '../utils';

export async function getIncomesStats(query: IncomesQueriesType){
    const queryString = formatRequestQuery(query)
    return await axiosInstance
        .get(`${API_ROUTES.INCOMES}${queryString}`)
        .then((resp: AxiosResponse<TGenericResponse<IncomesStatsEntity[]>>) => resp.data)
        .catch(error => {throw new Error(error)})
}