import { GenerateBarcodeDTO } from './dto/generate-barcode.dto';
import { Injectable, Logger } from '@nestjs/common';
import { RenderOptions, toBuffer } from 'bwip-js';
import { promises, ensureDir } from 'fs-extra';
import { join } from 'path';
import { pdfGenerator } from './pdfgenerator';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { CreateInvoiceDTO } from './dto/create-invoice.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '@/prisma.service';
import { InvoicePDFParamsDto } from './dto/invoice-pdf-params.dto';
@Injectable()
export class InvoicesService {
  private loger = new Logger(InvoicesService.name);
  constructor(
    private configService: ConfigService,
    private prismaClient: PrismaService,
  ) {}
  async createInvoice(createInvoiceDto: CreateInvoiceDTO) {
    try {
      const code = uuidv4();
      const invoice = await this.prismaClient.invoice.create({
        data: {
          code,
          advance: createInvoiceDto.advance,
          command: {
            connect: {
              id: createInvoiceDto.commandId,
            },
          },
        },
      });

      const invoiceWithDetails = await this.prismaClient.invoice.findUnique({
        where: {
          id: invoice.id,
        },
        select: {
          code: true,
          advance: true,
          createdAt: true,
          command: {
            select: {
              withdrawDate: true,
              code: true,
              discount: true,
              user: {
                select: {
                  username: true,
                  phone: true,
                  address: true,
                },
              },
              services: {
                select: {
                  quantity: true,
                  service: {
                    select: {
                      label: true,
                      price: true,
                    },
                  },
                },
              },
              customer: {
                select: {
                  name: true,
                  phone: true,
                  address: true,
                },
              },
            },
          },
        },
      });
      const barcodeDirPath = this.getFileSubPath(
        this.configService.get('COMMAND_BARCODE_ROOT_PATH'),
      );
      const pdfDirPath = this.getFileSubPath(
        this.configService.get('INVOICES_ROOT_PATH'),
      );

      await ensureDir(barcodeDirPath);
      await ensureDir(pdfDirPath);

      const barcodeFilePath = join(
        barcodeDirPath,
        `${invoice.code}-barcode.png`,
      );
      const pdfFilePath = join(pdfDirPath, `${invoice.code}.pdf`);
      await this.generateInvoiceBarcode({
        barcodeText: invoice.code,
        outputPath: barcodeFilePath,
      });
      const params: InvoicePDFParamsDto = {
        pdfFilePath,
        barcodeFilePath,
        invoice: invoiceWithDetails,
      };
      await pdfGenerator(params);
    } catch (error) {
      this.loger.error('Erreur lors de la génération du PDF:', error);
      throw new Error('Erreur lors de la génération du PDF:');
    }

    return {
      message: 'Facture créée',
    };
  }

  private async generateInvoiceBarcode(dto: GenerateBarcodeDTO) {
    // Options pour le code-barres
    const options: RenderOptions = {
      bcid: 'code128',
      text: dto.barcodeText,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'justify',
    };
    try {
      // Générer le code-barres
      const png = await toBuffer(options);
      const fullOutputPath = dto.outputPath;

      await promises.writeFile(fullOutputPath, png);
      this.loger.log(`Code-barres sauvegardé à ${fullOutputPath}`);
      return {
        message: 'Code-barres sauvegardé',
      };
    } catch (error) {
      this.loger.error('Erreur lors de la génération du code-barres:', error);
      throw new Error('Erreur lors de la génération du code-barres:');
    }
  }

  private getFileSubPath(rootPath: string) {
    return join(rootPath, `${dayjs().format('YYYY/MM')}/`);
  }
}
