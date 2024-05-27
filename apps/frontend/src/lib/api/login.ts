import z from "zod"
import { axiosInstance } from "../plugins/axios"

export const LoginFormSchema = z.object({
    password: z.string(),
    phone: z.string().min(9, 'Le numéro de téléphone doit contenir 9 chiffres').max(9, 'Le numéro de téléphone doit contenir 9 chiffres')
})
export const loginQuery = async (data: z.infer<typeof LoginFormSchema>) => {
    return await axiosInstance.post('/auth/login', { password: data.password, phone: +data.phone} )
}