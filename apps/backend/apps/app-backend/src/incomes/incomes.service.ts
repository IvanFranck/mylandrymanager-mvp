import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { IncomesQueriesDTO } from './dto/incomes-params.dto';
import { AccessTokenValidatedRequestInterface } from '@common-app-backend/interfaces/access-token-validated-request.interface';
import { IncomesStats } from '@prisma/client';
import { CustomResponseInterface } from '@app-backend/common/interfaces/response.interface';

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
    };
  }
}
