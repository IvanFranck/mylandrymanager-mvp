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
    currentVersionId: number
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
    advance: number,
    customer: CustomersEntity,
    code: string,
    status: CommandStatus,
    services: ServiceOnCommandEntity[]
}

export type InvoiceENtity = BaseEntity & {
    code:string,
    fileName: string
    commandId: number,
    amountPaid: number
}

export type CommandStatus = 'PENDING' | 'PAID' | 'NOT_PAID'