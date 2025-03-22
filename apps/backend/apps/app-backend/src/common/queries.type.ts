import { CommandStatus } from '@prisma/client';

export type GenericQueryType = {
  agencyId?: number;
};

export type CommandQueriesType = GenericQueryType & {
  code?: string;
  status?: CommandStatus;
  createdAt?: string;
  price?: string;
  from?: string;
  to?: string;
};
