import { Module } from '@nestjs/common';
import { WhatsappMessagingController } from './whatsapp-messaging.controller';
import { WhatsappMessagingService } from './whatsapp-messaging.service';
import { ConfigModule } from '@nestjs/config';
import joi from 'joi';
import { RmqModule } from '@app/rmq';
import { WHATSAPP_MESSAGING_SERVICE } from '@app/event-patterns';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    RmqModule.register({
      name: WHATSAPP_MESSAGING_SERVICE,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        WHATSAPP_API_TOKEN: joi.string().required(),
        WHATSAPP_API_PHONE_NUMBER_ID: joi.string().required(),
        WHATSAPP_API_VERSION: joi.string().required(),
      }),
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [WhatsappMessagingController],
  providers: [WhatsappMessagingService],
})
export class WhatsappMessagingModule {}
