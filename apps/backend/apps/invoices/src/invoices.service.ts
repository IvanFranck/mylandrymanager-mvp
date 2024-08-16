import { GenerateBarcodeDTO } from './dto/generate-barcode.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RenderOptions, toBuffer } from 'bwip-js';
import { promises, ensureDir } from 'fs-extra';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '@app/prisma/prisma.service';
import { InvoicePDFParamsDto } from './dto/invoice-pdf-params.dto';
import Hashids from 'hashids';
import {
  SEND_WHATSAPP_MESSAGE_EVENT,
  SendWhatsappTextMessageDto,
  WHATSAPP_MESSAGING_SERVICE,
} from '@app/event-patterns';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { pdfGenerator } from './pdfgenerator';
import { CreateInvoiceEventDTO } from '@app/event-patterns/dto/create-invoice.dto';
import { S3Service } from './s3.service';
@Injectable()
export class InvoicesService {
  private loger = new Logger(InvoicesService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaClient: PrismaService,
    private readonly storageService: S3Service,
    @Inject(WHATSAPP_MESSAGING_SERVICE)
    private readonly whatsappMessagingService: ClientProxy,
  ) {}
  async createInvoice(createInvoiceDto: CreateInvoiceEventDTO) {
    console.log('event payload', createInvoiceDto);
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
        Number(this.configService.get('CODE_MIN_LENGTH')),
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
      await this.storageService.uploadSIngleFile({
        fileKey: invoice.code,
        filePath: pdfFilePath,
        isPublic: true,
      });

      /*await lastValueFrom<SendWhatsappTextMessageDto>(
        this.whatsappMessagingService.emit(SEND_WHATSAPP_MESSAGE_EVENT, {
          type: 'invoice',
          to: invoice.command.customer.phone,
          invoiceCode: invoice.code,
        }),
      );*/
    } catch (error) {
      this.loger.error('Erreur lors de la génération de la facture:', error);
      throw new BadRequestException(
        'Erreur lors de la génération de la facture',
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
