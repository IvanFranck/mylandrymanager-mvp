import { NestFactory } from '@nestjs/core';
import { IncomesStatsModule } from './incomes-stats.module';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(IncomesStatsModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RMQ_URI')],
      queue: configService.get<string>('RMQ_INCOMES_STATS_QUEUE'),
      noAck: false,
      persistent: true,
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
