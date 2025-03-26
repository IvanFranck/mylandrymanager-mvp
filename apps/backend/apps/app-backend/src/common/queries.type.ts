import { CommandStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';

export class GenericQueryType {
  @IsNumber()
  @Type(() => Number)
  agencyId: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number;
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

export class SearchByNameQueriesType extends GenericQueryType {
  @IsString()
  name: string;
}
