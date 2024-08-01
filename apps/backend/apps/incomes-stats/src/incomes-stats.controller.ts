import { Controller, Get } from '@nestjs/common';
import { IncomesStatsService } from './incomes-stats.service';

@Controller()
export class IncomesStatsController {
  constructor(private readonly incomesStatsService: IncomesStatsService) {}

  @Get()
  getHello(): string {
    return this.incomesStatsService.getHello();
  }
}
