import { Controller } from '@nestjs/common';
import { WhatsappMessagingService } from './whatsapp-messaging.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  COMMAND_CREATED_EVENT,
  INVOICE_CREATED_EVENT,
  InvoiceMessageDto,
  OrderConfirmationTextMessageDto,
} from '@app/event-patterns';
import { RmqService } from '@app/rmq';

@Controller({ path: 'whatsapp-messaging', version: '1' })
export class WhatsappMessagingController {
  constructor(
    private readonly whatsappMessagingService: WhatsappMessagingService,
    private readonly rmqService: RmqService,
  ) {}
  @EventPattern(COMMAND_CREATED_EVENT)
  async sendOrderCretaionConfirmationMessage(
    @Payload() data: OrderConfirmationTextMessageDto,
    @Ctx() context: RmqContext,
  ) {
    await this.whatsappMessagingService.sendOrderConfirmationMessage(data);
    this.rmqService.ack(context);
  }

  @EventPattern(INVOICE_CREATED_EVENT)
  async sendInvoiceMessage(
    @Payload() data: InvoiceMessageDto,
    @Ctx() context: RmqContext,
  ) {
    await this.whatsappMessagingService.sendInvoiceMessage(data);
    this.rmqService.ack(context);
  }
}
