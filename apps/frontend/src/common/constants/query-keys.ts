import { CommandQueriesType } from "@/lib/types/query.filter.types"

// auth
export const LOGIN_QUERY_KEY = ['login_key']
export const REGISTER_QUERY_KEY = ['login_key']

// services
export const SERVICES_QUERY_KEY = ["services_key"]
export const SERVICE_ID_QUERY_KEY = (id: number) => ["service_id_key", id]

// customers
export const CUSTOMERS_QUERY_KEY = ["customers_key"]

// commands
export const COMMANDS_QUERY_KEY = ["commands_key"]
export const COMMAND_ID_QUERY_KEY = (id: number) => ["command_id_key", id]
export const COMMANDS_FILTER_QUERY_KEY = (filter: CommandQueriesType) => ["command_id_key", filter]

// invoices
export const COMMAND_INVOICES_ID_KEY = (id: number) => ["command_invoices_id_key", id]