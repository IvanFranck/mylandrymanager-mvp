import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { IncomesStats } from '@prisma/client';
import { CustomResponseInterface } from '@app-backend/common/interfaces/response.interface';
import { IncomesQueriesType } from '@app-backend/common/queries.type';

@Injectable()
export class IncomesService {
  constructor(private readonly prisma: PrismaService) {}

  async getIncomes(
    query: IncomesQueriesType,
  ): Promise<CustomResponseInterface<IncomesStats[]>> {
    const { from, to, agencyId } = query;
    const stats = await this.prisma.$transaction(async (tx) => {
      return await tx.incomesStats.findMany({
        where: {
          agencyId,
          createdAt:
            from && to
              ? {
                  lte: new Date(to),
                  gte: new Date(from),
                }
              : undefined,
        },
        include: {
          incomes: true,
        },
      });
    });

    return {
      message: 'les entrées',
      details: stats,
    };
  }
}
