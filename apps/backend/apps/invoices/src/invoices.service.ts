import { GenerateBarcodeDTO } from './dto/generate-barcode.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RenderOptions, toBuffer } from 'bwip-js';
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

      const fileKey = uuidv4();
      const hashIds = new Hashids(
        this.configService.get('CODE_SALT'),
        Number(this.configService.get('CODE_MIN_LENGTH')),
        this.configService.get('CODE_ALPHABET'),
      );

      const invoice = await this.prismaClient.$transaction(async (tx) => {
        const newInvoice = await tx.invoice.create({
          data: {
            amountPaid: createInvoiceDto.advance,
            command: {
              connect: {
                id: createInvoiceDto.commandId,
              },
            },
          },
          select: {
            id: true,
            command: {
              select: {
                user: {
                  select: {
                    username: true,
                  },
                },
                customer: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });
        // build file path
        const pdfDirPath = this.getFileSubPath(
          this.configService.get('INVOICES_ROOT_PATH'),
        );
        const pdfFilePath = join(
          pdfDirPath,
          `${newInvoice.command.user.username}__${newInvoice.command.customer.name}__facture-${fileKey}.pdf`,
        );

        //generate invoice code
        const code = hashIds.encode(newInvoice.id);
        const invoice = await tx.invoice.update({
          where: {
            id: newInvoice.id,
          },
          data: {
            fileName: pdfFilePath,
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

      const barcodeBuffer = await this.generateInvoiceBarcode({
        barcodeText: invoice.code,
      });
      const params: InvoicePDFParamsDto = {
        barcodeBuffer,
        invoice: invoice,
      };
      const pdfStream: Buffer = (await pdfGenerator(params)) as Buffer;
      await this.storageService.uploadSIngleFile({
        fileKey: invoice.fileName,
        file: pdfStream,
        tagList: {
          customer: invoice.command.customer.name,
          user: invoice.command.user.username,
          billId: fileKey,
        },
        isPublic: true,
      });

      await lastValueFrom<SendWhatsappTextMessageDto>(
        this.whatsappMessagingService.emit(SEND_WHATSAPP_MESSAGE_EVENT, {
          type: 'invoice',
          to: invoice.command.customer.phone,
          invoiceCode: invoice.code,
        }),
      );
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
      return await toBuffer(options);
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
