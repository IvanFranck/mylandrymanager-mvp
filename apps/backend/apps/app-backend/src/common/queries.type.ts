import { CommandStatus } from '@prisma/client';

export type CommandQueriesType = {
  code?: string;
  status?: CommandStatus;
  createdAt?: string;
  price?: string;
  from?: string;
  to?: string;
};
