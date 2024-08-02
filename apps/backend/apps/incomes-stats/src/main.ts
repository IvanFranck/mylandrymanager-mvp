import { NestFactory } from '@nestjs/core';
import { IncomesStatsModule } from './incomes-stats.module';
import { RmqOptions } from '@nestjs/microservices';
import { RmqService } from '@app/rmq';
import { INCOMES_STATS_SERVICE } from '@app/event-patterns';

async function bootstrap() {
  const app = await NestFactory.create(IncomesStatsModule);
  const rmqService = app.get(RmqService);

  app.connectMicroservice<RmqOptions>(
    rmqService.getOptions(INCOMES_STATS_SERVICE),
  );
  await app.startAllMicroservices();
}
bootstrap();
