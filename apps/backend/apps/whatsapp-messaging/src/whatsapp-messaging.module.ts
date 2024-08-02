import { Module } from '@nestjs/common';
import { WhatsappMessagingController } from './whatsapp-messaging.controller';
import { WhatsappMessagingService } from './whatsapp-messaging.service';
import { ConfigModule } from '@nestjs/config';
import joi from 'joi';
import { RmqModule } from '@app/rmq';
import { WHATSAPP_MESSAGING_SERVICE } from '@app/event-patterns';

@Module({
  imports: [
    RmqModule.register({
      name: WHATSAPP_MESSAGING_SERVICE,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        TWILIO_VERIFY_API_BASE_URL: joi.string().required(),
        TWILIO_VERIFY_API_ACCOUNT_SID: joi.string().required(),
        TWILIO_VERIFY_API_AUTH_KEY: joi.string().required(),
        TWILIO_VERIFY_API_SERVICE_ID: joi.string().required(),
        TWILIO_VERIFY_API_PHONE_NUMBER: joi.string().required(),
        INVOICE_BASE_URL: joi.string().required(),
        RABBIT_MQ_WHATSAPP_MESSAGING_SERVICE_QUEUE: joi.string().required(),
      }),
    }),
  ],
  controllers: [WhatsappMessagingController],
  providers: [WhatsappMessagingService],
})
export class WhatsappMessagingModule {}
