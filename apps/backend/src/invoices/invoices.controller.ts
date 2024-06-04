import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDTO } from './dto/create-invoice.dto';
import { AccessTokenAuthGuard } from '@/auth/guards/access-token-auth.guard';
import type { Response } from 'express';
@Controller({
  path: 'invoices',
  version: '1',
})
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @UseGuards(AccessTokenAuthGuard)
  @Post()
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDTO) {
    return await this.invoicesService.createInvoice(createInvoiceDto);
  }

  @Get('file/:path')
  async getInvoice(
    @Res({ passthrough: true }) res: Response,
    @Param('path') filePath: string,
  ): Promise<StreamableFile> {
    res.set({
      'Content-Disposition': 'attachment; filename="invoice.pdf"',
    });
    const invoice = await this.invoicesService.getInvoice(filePath);
    return new StreamableFile(invoice);
  }
}
