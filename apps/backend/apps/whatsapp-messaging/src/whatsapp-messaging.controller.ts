import { Controller } from '@nestjs/common';
import { WhatsappMessagingService } from './whatsapp-messaging.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  SEND_WHATSAPP_MESSAGE_EVENT,
  SendWhatsappTextMessageDto,
} from '@app/event-patterns';
import { RmqService } from '@app/rmq';

@Controller({ path: 'whatsapp-messaging', version: '1' })
export class WhatsappMessagingController {
  constructor(
    private readonly whatsappMessagingService: WhatsappMessagingService,
    private readonly rmqService: RmqService,
  ) {}
  @EventPattern(SEND_WHATSAPP_MESSAGE_EVENT)
  async sendMessage(
    @Payload() data: SendWhatsappTextMessageDto,
    @Ctx() context: RmqContext,
  ) {
    await this.whatsappMessagingService.sendMessage(data);
    this.rmqService.ack(context);
  }
}
