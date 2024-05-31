import { Module } from '@nestjs/common';
import { WhatsappMessagingController } from './whatsappmessaging.controller';
import { WhatsappMessagingService } from './whatsappmessaging.service';

@Module({
  controllers: [WhatsappMessagingController],
  providers: [WhatsappMessagingService],
})
export class WhatsappMessagingModule {}
