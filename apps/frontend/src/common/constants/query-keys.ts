import { CommandQueriesType, GenericQueryType, IncomesQueriesType } from "@/lib/types/query.filter.types"

// auth
export const LOGIN_QUERY_KEY = ['login_key']
export const REGISTER_QUERY_KEY = ['login_key']

// services
export const SERVICES_QUERY_KEY = (filter: Record<string, unknown>) => ["services_key", filter]
export const SERVICE_ID_QUERY_KEY = (id: number, query: GenericQueryType) => ["service_id_key", id, query]

// customers
export const CUSTOMERS_QUERY_KEY = (filter: Record<string, unknown>) => ["customers_key", filter]

// commands
export const COMMANDS_QUERY_KEY = ["commands_key"]
export const COMMAND_ID_QUERY_KEY = (id: number) => ["command_id_key", id]
export const COMMANDS_FILTER_QUERY_KEY = (filter: CommandQueriesType) => ["command_id_key", filter]

// invoices
export const COMMAND_INVOICES_ID_KEY = (id: number) => ["command_invoices_id_key", id]

// incomes
export const INCOMES_FILTER_QUERY_KEY = (filter: IncomesQueriesType) => ["incomes_id_key", filter]

//user
export const USER_PROFILE_QUERY_KEY = ["user_profile_key"]