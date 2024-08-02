import { Module } from '@nestjs/common';
import { IncomesStatsController } from './incomes-stats.controller';
import { IncomesStatsService } from './incomes-stats.service';
import { RmqModule } from '@app/rmq';

@Module({
  imports: [
    RmqModule.register({
      name: 'INCOMES_STATS_SERVICE',
    }),
  ],
  controllers: [IncomesStatsController],
  providers: [IncomesStatsService],
})
export class IncomesStatsModule {}
