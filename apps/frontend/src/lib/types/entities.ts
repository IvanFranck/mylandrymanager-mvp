export type UserEntity = {
    id: number
    createdAt: Date
    updatedAt: Date
    username: string
    phone: number
    password: string
    signUpCompleted: boolean
    services: ServicesEntity[]
}

export type ServicesEntity = {
    id: number
    createdAt: Date
    updatedAt: Date
    label: string
    price: number
    description: string | undefined
    userId: number
}