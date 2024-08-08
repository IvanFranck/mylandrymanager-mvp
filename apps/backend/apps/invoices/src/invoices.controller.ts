import { Controller } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CREATE_INVOICE_EVENT } from '@app/event-patterns';
import { CreateInvoiceEventDTO } from '@app/event-patterns/dto/create-invoice.dto';
import { RmqService } from '@app/rmq';

@Controller()
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern(CREATE_INVOICE_EVENT)
  async createInvoice(
    @Payload() data: CreateInvoiceEventDTO,
    @Ctx() context: RmqContext,
  ) {
    await this.invoicesService.createInvoice(data);
    this.rmqService.ack(context);
  }
}
