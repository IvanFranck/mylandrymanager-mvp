import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { IncomesQueriesDTO } from './dto/incomes-params.dto';
import { AccessTokenValidatedRequestInterface } from '@common-app-backend/interfaces/access-token-validated-request.interface';
import { IncomesStats } from '@prisma/client';
import { CustomResponseInterface } from '@app-backend/common/interfaces/response.interface';
import { endOfWeek, nextDay, previousDay, startOfWeek } from 'date-fns';

@Injectable()
export class IncomesService {
  constructor(private readonly prisma: PrismaService) {}

  async getIncomes(
    query: IncomesQueriesDTO,
    request: AccessTokenValidatedRequestInterface,
  ): Promise<CustomResponseInterface<IncomesStats[]>> {
    const userId = request.user.sub;
    const { from, to } = query;
    const stats = await this.prisma.$transaction(async (tx) => {
      return await tx.incomesStats.findMany({
        where: {
          accountId: userId,
          createdAt:
            from && to
              ? {
                  lte: new Date(to),
                  gte: new Date(from),
                }
              : undefined,
        },
      });
    });

    return {
      message: 'les entrées',
      details: stats,
      meta: {
        prev: this.getPaginationPrevLink(query),
        next: this.getPaginationNextLink(query),
      },
    };
  }

  private getPaginationNextLink(query: IncomesQueriesDTO): string {
    const nextMonday = nextDay(new Date(query.from), 1);
    const queryParams = {
      from: startOfWeek(nextMonday, { weekStartsOn: 1 }).toISOString(),
      to: endOfWeek(nextMonday, { weekStartsOn: 1 }).toISOString(),
    };
    const queryString = Object.entries(queryParams)
      .map(([key, value], index) => {
        return value
          ? index === 0
            ? `?${key}=${value}`
            : `&${key}=${value}`
          : '';
      })
      .join('');
    return queryString;
  }

  private getPaginationPrevLink(query: IncomesQueriesDTO): string {
    const prevMonday = previousDay(new Date(query.from), 1);
    const queryParams = {
      from: startOfWeek(prevMonday, { weekStartsOn: 1 }).toISOString(),
      to: endOfWeek(prevMonday, { weekStartsOn: 1 }).toISOString(),
    };
    const queryString = Object.entries(queryParams)
      .map(([key, value], index) => {
        return value
          ? index === 0
            ? `?${key}=${value}`
            : `&${key}=${value}`
          : '';
      })
      .join('');
    return queryString;
  }
}