import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDTO } from './dto/create-invoice.dto';
import { AccessTokenAuthGuard } from '@/auth/guards/access-token-auth.guard';

@UseGuards(AccessTokenAuthGuard)
@Controller({
  path: 'invoices',
  version: '1',
})
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDTO) {
    return await this.invoicesService.createInvoice(createInvoiceDto);
  }
}
