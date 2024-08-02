import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Command } from '@prisma/client';

@Injectable()
export class IncomesStatsService {
  constructor(private readonly prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async createIncome(command: Command) {
    console.log('command payload', command);
    try {
      await this.prisma.incomesStats.create({
        data: {
          ammount: command.advance,
          day: command.createdAt,
          user: {
            connect: {
              id: command.userId,
            },
          },
        },
      });
    } catch (error) {
      console.log('error when creating incomes stats', error);
    }
  }
}
