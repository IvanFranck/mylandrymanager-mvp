import { CommandStatus } from '@prisma/client';
import { IsISO8601, IsNumber } from 'class-validator';

export class GenericQueryType {
  @IsNumber()
  agencyId?: number;
}

export class CommandQueriesType extends GenericQueryType {
  code?: string;
  status?: CommandStatus;
  createdAt?: string;
  price?: string;
  from?: string;
  to?: string;
}

export class IncomesQueriesType extends GenericQueryType {
  @IsISO8601()
  from: string;

  @IsISO8601()
  to: string;
}
