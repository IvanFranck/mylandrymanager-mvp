import { Module } from '@nestjs/common';
import { IncomesStatsController } from './incomes-stats.controller';
import { IncomesStatsService } from './incomes-stats.service';

@Module({
  imports: [],
  controllers: [IncomesStatsController],
  providers: [IncomesStatsService],
})
export class IncomesStatsModule {}
