import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Command } from '@prisma/client';
import { format } from 'date-fns';

@Injectable()
export class IncomesStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async handleIncomes(command: Command) {
    console.log('command payload', command);
    const date = format(command.updatedAt, 'dd/MM/yyyy');
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.incomes.create({
          data: {
            amount: command.advance,
            command: {
              connect: {
                id: command.id,
              },
            },
            incomeStats: {
              connectOrCreate: {
                where: {
                  day_agencyId: {
                    day: date,
                    agencyId: command.agencyId,
                  },
                },
                create: {
                  day: date,
                  user: {
                    connect: {
                      id: command.userId,
                    },
                  },
                  Agency: {
                    connect: {
                      id: command.agencyId,
                    },
                  },
                },
              },
            },
            Agency: {
              connect: {
                id: command.agencyId,
              },
            },
          },
        });
        return await tx.incomesStats.findUnique({
          where: {
            day_agencyId: {
              day: date,
              agencyId: command.agencyId,
            },
          },
        });
      });
    } catch (error) {
      console.log('error when creating incomes stats', error);
    }
  }
}
