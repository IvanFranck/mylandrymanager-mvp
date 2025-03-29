import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import type { Response } from 'express';
import { AccessTokenAuthGuard } from '@app-backend/auth/guards/access-token-auth.guard';
import { AccessTokenValidatedRequestInterface } from '@app-backend/common/interfaces/access-token-validated-request.interface';
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
    @Req() req: AccessTokenValidatedRequestInterface,
  ) {
    const userId = req.user.sub;

    return await this.invoicesService.getInvoicesByCommandId(commandId, userId);
  }

  @Get(':invoiceCode')
  async getInvoiceByCode(
    @Res({ passthrough: true }) res: Response,
    @Param('invoiceCode') invoiceCode: string,
  ): Promise<StreamableFile> {
    const { stream, filename } =
      await this.invoicesService.getInvoiceByCode(invoiceCode);
    res.set({
      'Content-Disposition': `inline; filename="facture-${filename}.pdf"`,
    });

    return new StreamableFile(stream);
  }

  @Get('file/:path')
  async getInvoice(
    @Res({ passthrough: true }) res: Response,
    @Param('path') filePath: string,
  ): Promise<StreamableFile> {
    res.set({
      'Content-Disposition': 'inline; filename="invoice.pdf"',
    });
    const invoice = await this.invoicesService.getInvoice(filePath);
    return new StreamableFile(invoice);
  }

  /**
   * Récupère l'URL de la facture pour le personnel
   */
  @Get('staff/:invoiceId')
  @UseGuards(AccessTokenAuthGuard)
  async getStaffInvoiceUrl(
    @Param(
      'invoiceId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    invoiceId: number,
    @Req() req: AccessTokenValidatedRequestInterface,
  ) {
    const userId = req.user.sub;

    const url = await this.invoicesService.getInvoiceUrlForStaff(
      invoiceId,
      userId,
    );

    return { url };
  }
}
