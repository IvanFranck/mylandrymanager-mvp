import { Controller, Get } from '@nestjs/common';
import { IncomesStatsService } from './incomes-stats.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/rmq';

@Controller()
export class IncomesStatsController {
  constructor(
    private readonly incomesStatsService: IncomesStatsService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  getHello(): string {
    return this.incomesStatsService.getHello();
  }

  @EventPattern('test_event')
  async test(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('data test_event', data);
    this.rmqService.ack(context);
  }
}
