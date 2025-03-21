import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Command } from '@prisma/client';
import { format } from 'date-fns';

@Injectable()
export class IncomesStatsService {
  constructor(private readonly prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async handleIncomes(command: Command) {
    console.log('command payload', command);
    const date = format(command.updatedAt, 'dd/MM/yyyy');
    try {
      await this.prisma.$transaction(async (tx) => {
        const incomeStat = await tx.incomesStats.findUnique({
          where: {
            day_accountId: {
              day: date,
              accountId: command.userId,
            },
          },
        });

        if (incomeStat) {
          return await tx.incomesStats.update({
            where: {
              day_accountId: {
                day: date,
                accountId: command.userId,
              },
            },
            data: {
              incomes: {
                create: {
                  amount: command.advance,
                  command: {
                    connect: {
                      id: command.id,
                    },
                  },
                },
              },
            },
          });
        }
        return await tx.incomesStats.create({
          data: {
            createdAt: command.updatedAt,
            day: date,
            accountId: command.userId,
            incomes: {
              create: {
                amount: command.advance,
                command: {
                  connect: {
                    id: command.id,
                  },
                },
              },
            },
          },
        });
      });
    } catch (error) {
      console.log('error when creating incomes stats', error);
    }
  }
}
