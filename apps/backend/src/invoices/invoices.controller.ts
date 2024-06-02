import { Controller, Get } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller({
  path: 'invoices',
  version: '1',
})
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async createInvoice() {
    return await this.invoicesService.createInvoice();
  }
}
