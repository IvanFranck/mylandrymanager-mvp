import { CommandStatus } from "./entities";

export type CommandQueriesType = {
    status?: CommandStatus;
    createdAt?: string;
    price?: string;
    from?: string,
    to?: string
  };
  