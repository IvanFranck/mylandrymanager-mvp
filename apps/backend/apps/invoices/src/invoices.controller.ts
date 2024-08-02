import { Controller } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { EventPattern } from '@nestjs/microservices';
import { CREATE_INVOICE_EVENT } from '@app/event-patterns';
import { CreateInvoiceEventDTO } from '@app/event-patterns/dto/create-invoice.dto';

@Controller()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @EventPattern(CREATE_INVOICE_EVENT)
  async createInvoice(data: CreateInvoiceEventDTO) {
    await this.invoicesService.createInvoice(data);
  }
}
