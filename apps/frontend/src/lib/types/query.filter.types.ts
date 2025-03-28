import { CommandStatus } from "./entities";

export type CommandQueriesType = GenericQueryType & {
    code?: string;
    status?: CommandStatus;
    createdAt?: string;
    price?: string;
    from?: string,
    to?: string
};

export type IncomesQueriesType = GenericQueryType & {
  from: string,
  to: string
};

export type GenericQueryType = {
  agencyId?: number
  limit?: number
}