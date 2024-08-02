import { Controller } from '@nestjs/common';
import { IncomesStatsService } from './incomes-stats.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/rmq';
import { HANDLE_COMMAND_EVENT } from '@app/event-patterns';
import { Command } from '@prisma/client';

@Controller()
export class IncomesStatsController {
  constructor(
    private readonly incomesStatsService: IncomesStatsService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern(HANDLE_COMMAND_EVENT)
  async handleIncomes(@Payload() data: Command, @Ctx() context: RmqContext) {
    await this.incomesStatsService.handleIncomes(data);
    this.rmqService.ack(context);
  }

  @EventPattern('test_event')
  async test(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('data test_event', data);
    this.rmqService.ack(context);
  }
}
