import { CommandStatus } from "./entities";

export type CommandQueriesType = {
    status?: CommandStatus;
    createdAt?: string;
    price?: string;
    from?: string,
    to?: string
};

export type IncomesQueriesType = {
  from: string,
  to: string
};
  