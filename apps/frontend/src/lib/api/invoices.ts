import { API_ROUTES } from "@/common/constants/api-routes"
import { axiosInstance } from "../plugins/axios"
import { AxiosResponse } from "axios"
import { TGenericResponse } from "../types/responses"
import { InvoiceENtity } from "../types/entities"

export async function fetchAllCommandInvoices(id: number) {
    return await axiosInstance
                .get(`${API_ROUTES.INVOICES}/command/${id}`)
                .then((resp: AxiosResponse<TGenericResponse<InvoiceENtity>>) => {
                    return resp.data.details
                })
}