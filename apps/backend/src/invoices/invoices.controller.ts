import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import type { Response } from 'express';
import { AccessTokenAuthGuard } from '@/auth/guards/access-token-auth.guard';
@Controller({
  path: 'invoices',
  version: '1',
})
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // @UseGuards(AccessTokenAuthGuard)
  // @Post()
  // async createInvoice(@Body() createInvoiceDto: CreateInvoiceDTO) {
  //   return await this.invoicesService.createInvoice(createInvoiceDto);
  // }

  @UseGuards(AccessTokenAuthGuard)
  @Get('/command/:commandId')
  async getAllInvoicesByCommandId(
    @Param(
      'commandId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    commandId: number,
  ) {
    return await this.invoicesService.getInvoicesByCommandId(commandId);
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
