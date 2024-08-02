import { Module } from '@nestjs/common';
import { IncomesStatsController } from './incomes-stats.controller';
import { IncomesStatsService } from './incomes-stats.service';
import { RmqModule } from '@app/rmq';
import { PrismaService } from '@app/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { INCOMES_STATS_SERVICE } from '@app/event-patterns';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_INCOMES_STATS_SERVICE_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule.register({
      name: INCOMES_STATS_SERVICE,
    }),
  ],
  controllers: [IncomesStatsController],
  providers: [IncomesStatsService, PrismaService],
})
export class IncomesStatsModule {}
