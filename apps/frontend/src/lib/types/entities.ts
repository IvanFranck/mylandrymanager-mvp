type BaseEntity = {
    id: number
    createdAt: Date
    updatedAt: Date
}
export type UserEntity = BaseEntity & {
    username: string
    phone: number
    password: string
    signUpCompleted: boolean
    services: ServicesEntity[]
}

export type ServicesEntity = BaseEntity & {
    label: string
    price: number
    description: string | undefined
    userId: number
}

export type ServiceOnCommandEntity = {
    service: ServicesEntity,
    quantity: number
}

export type CustomersEntity = BaseEntity & {
    name: string
    phone: number,
    address: string
}

export type CommandsEntity = BaseEntity & {
    price: number
    description: string | undefined
    discount: number | null
    customerId: number
    userId: number
    withdrawDate: Date
    customer: CustomersEntity
    code: CommandCodeEntity
    services: ServiceOnCommandEntity[]
}

export type CommandCodeEntity = Omit<BaseEntity, 'updatedAt'> & {
    code: string,
    commandId: number
}