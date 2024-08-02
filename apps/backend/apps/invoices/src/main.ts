import { NestFactory } from '@nestjs/core';
import { InvoicesModule } from './invoices.module';
import { RmqService } from '@app/rmq';
import { CREATE_INVOICES_SERVICE } from '@app/event-patterns';
import { RmqOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(InvoicesModule);
  const rmqService = app.get(RmqService);

  app.connectMicroservice<RmqOptions>(
    rmqService.getOptions(CREATE_INVOICES_SERVICE),
  );
  await app.startAllMicroservices();
}
bootstrap();
