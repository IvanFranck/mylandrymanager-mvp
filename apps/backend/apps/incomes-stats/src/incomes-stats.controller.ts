import { Controller, Get } from '@nestjs/common';
import { IncomesStatsService } from './incomes-stats.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/rmq';
import { CREATE_COMMAND_EVENT } from '@app/event-patterns';
import { Command } from '@prisma/client';

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

  @EventPattern(CREATE_COMMAND_EVENT)
  async createIncome(@Payload() data: Command, @Ctx() context: RmqContext) {
    await this.incomesStatsService.createIncome(data);
    this.rmqService.ack(context);
  }

  @EventPattern('test_event')
  async test(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('data test_event', data);
    this.rmqService.ack(context);
  }
}
