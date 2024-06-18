import { CommandStatus } from '@prisma/client';

export type CommandQueriesType = {
  status?: CommandStatus;
  createdAt?: string;
  price?: string;
  from?: string;
  to?: string;
};
