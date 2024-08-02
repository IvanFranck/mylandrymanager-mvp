import { NestFactory } from '@nestjs/core';
import { WhatsappMessagingModule } from './whatsapp-messaging.module';
import { WHATSAPP_MESSAGING_SERVICE } from '@app/event-patterns';
import { RmqService } from '@app/rmq';
import { RmqOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(WhatsappMessagingModule);
  const rmqService = app.get(RmqService);

  app.connectMicroservice<RmqOptions>(
    rmqService.getOptions(WHATSAPP_MESSAGING_SERVICE),
  );
  await app.startAllMicroservices();
}
bootstrap();
