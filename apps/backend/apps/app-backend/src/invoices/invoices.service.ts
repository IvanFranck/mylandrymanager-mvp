import { GenerateBarcodeDTO } from './dto/generate-barcode.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RenderOptions, toBuffer } from 'bwip-js';
import { promises, ensureDir, createReadStream, ReadStream } from 'fs-extra';
import { join } from 'path';
import { pdfGenerator } from './pdfgenerator';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { CreateInvoiceDTO } from './dto/create-invoice.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '@app-backend/prisma.service';
import { InvoicePDFParamsDto } from './dto/invoice-pdf-params.dto';
import Hashids from 'hashids';
import { CustomResponseInterface } from '@common-app-backend/interfaces/response.interface';
import { Invoice } from '@prisma/client';
@Injectable()
export class InvoicesService {
  private loger = new Logger(InvoicesService.name);
  constructor(
    private configService: ConfigService,
    private prismaClient: PrismaService,
  ) {}
  async createInvoice(createInvoiceDto: CreateInvoiceDTO) {
    try {
      const command = await this.prismaClient.command.findUnique({
        where: { id: createInvoiceDto.commandId },
      });

      if (!command) {
        throw new BadRequestException(
          `Command with ID ${createInvoiceDto.commandId} not found`,
        );
      }

      const filePath = uuidv4();
      const hashIds = new Hashids(
        this.configService.get('CODE_SALT'),
        this.configService.get('CODE_MIN_LENGTH'),
        this.configService.get('CODE_ALPHABET'),
      );

      const invoice = await this.prismaClient.$transaction(async (tx) => {
        const newInvoice = await tx.invoice.create({
          data: {
            fileName: filePath,
            amountPaid: createInvoiceDto.advance,
            command: {
              connect: {
                id: createInvoiceDto.commandId,
              },
            },
          },
        });

        const code = hashIds.encode(newInvoice.id);
        const invoice = await tx.invoice.update({
          where: {
            id: newInvoice.id,
          },
          data: {
            code,
          },
          select: {
            id: true,
            code: true,
            amountPaid: true,
            fileName: true,
            createdAt: true,
            command: {
              select: {
                withdrawDate: true,
                code: true,
                discount: true,
                advance: true,
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
        return invoice;
      });

      const barcodeDirPath = this.getFileSubPath(
        this.configService.get('COMMAND_BARCODE_ROOT_PATH'),
      );
      const pdfDirPath = this.getFileSubPath(
        this.configService.get('INVOICES_ROOT_PATH'),
      );

      await ensureDir(barcodeDirPath);
      await ensureDir(pdfDirPath);

      const barcodeFilePath = join(barcodeDirPath, `${invoice.fileName}.png`);
      const pdfFilePath = join(pdfDirPath, `${invoice.fileName}.pdf`);
      await this.generateInvoiceBarcode({
        barcodeText: invoice.code,
        outputPath: barcodeFilePath,
      });
      const params: InvoicePDFParamsDto = {
        pdfFilePath,
        barcodeFilePath,
        invoice: invoice,
      };
      await pdfGenerator(params);
    } catch (error) {
      this.loger.error('Erreur lors de la génération du PDF:', error);
      throw new BadRequestException('Erreur lors de la génération du PDF');
    }

    return {
      message: 'Facture créée',
    };
  }

  async getInvoicesByCommandId(
    commandId: number,
  ): Promise<CustomResponseInterface<Invoice[]>> {
    try {
      const invoices = await this.prismaClient.invoice.findMany({
        where: {
          commandId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return {
        message: `liste des facture de la command ${commandId}`,
        details: invoices,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(error);
    }
  }

  async getInvoice(filePath: string): Promise<ReadStream> {
    try {
      const invoice = await this.prismaClient.invoice.findUnique({
        where: { fileName: filePath },
      });
      if (!invoice) {
        throw new BadRequestException(
          `Facture avec le nom de fichier ${filePath} non trouvée`,
        );
      }
      const pdfFileRootPath = this.getFileSubPath(
        this.configService.get('INVOICES_ROOT_PATH'),
        invoice.createdAt,
      );
      const pdfFilePath = join(pdfFileRootPath, `${invoice.fileName}.pdf`);

      return createReadStream(pdfFilePath);
    } catch (error) {
      this.loger.error('Erreur lors de la récupération de la facture:', error);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération de la facture:',
      );
    }
  }

  async getInvoiceByCode(invoiceCode: string): Promise<ReadStream> {
    try {
      const invoice = await this.prismaClient.invoice.findUnique({
        where: {
          code: invoiceCode,
        },
      });
      if (!invoice) {
        throw new BadRequestException(
          `Impossible de retouver la facture n ${invoiceCode}`,
        );
      }

      const pdfFileRootPath = this.getFileSubPath(
        this.configService.get('INVOICES_ROOT_PATH'),
        invoice.createdAt,
      );
      const pdfFilePath = join(pdfFileRootPath, `${invoice.fileName}.pdf`);

      return createReadStream(pdfFilePath);
    } catch (error) {
      this.loger.error('Erreur lors de la récupération de la facture:', error);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération de la facture:',
      );
    }
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

  private getFileSubPath(rootPath: string, date?: Date) {
    if (date) {
      return join(rootPath, `${dayjs(date).format('YYYY/MM')}/`);
    }
    return join(rootPath, `${dayjs().format('YYYY/MM')}/`);
  }
}