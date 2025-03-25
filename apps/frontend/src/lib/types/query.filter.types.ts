import { CommandStatus } from "./entities";

export type CommandQueriesType = {
    code?: string;
    status?: CommandStatus;
    createdAt?: string;
    price?: string;
    from?: string,
    to?: string
    agencyId?: number
};

export type IncomesQueriesType = {
  from: string,
  to: string
};
  