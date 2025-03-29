type BaseEntity = {
    id: number
    createdAt: Date
    updatedAt: Date
}


export interface AgencyEntity {
    id: number
    address: string
    name: string
    phone: string
}
export type UserEntity = BaseEntity & {
    username: string
    phone: number
    agencyMemberships: {
        agencyId: number
        userId: number
        createdAt: Date
        agency: AgencyEntity
    }[]
    services: ServicesEntity[]
}



export type UserProfileEntity = {
    id: number
    username: string
    phone: string
    address: string
}

export type ServiceVersionEntity = BaseEntity & {
    label: string
    price: number
    description: string | undefined
}

export type ServicesEntity = BaseEntity & {
    isDeleted: boolean
    currentVersionId: number
    agencyId: number
    currentVersion: ServiceVersionEntity
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

type ServiceCommandEntity = {
    service: ServiceVersionEntity,
    quantity: number 
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
    services: ServiceCommandEntity[]
}



export type InvoiceENtity = BaseEntity & {
    code:string,
    fileName: string
    commandId: number,
    amountPaid: number
}

export type CommandInvoicesEntity = InvoiceENtity & {
    url: string
}

type IncomesEntity = BaseEntity & {
    commandId: number,
    amount: number,
    incomeStatsId: number
}

export type IncomesStatsEntity = Pick<BaseEntity, 'createdAt' | 'updatedAt'> & {
    day: string,
    incomes: Array<IncomesEntity>
    accountId: number
}

export type CommandStatus = 'PENDING' | 'PAID' | 'NOT_PAID'