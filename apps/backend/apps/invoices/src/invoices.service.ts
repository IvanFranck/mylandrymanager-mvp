import { GenerateBarcodeDTO } from './dto/generate-barcode.dto';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RenderOptions, toBuffer } from 'bwip-js';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@app/prisma/prisma.service';
import { InvoicePDFParamsDto } from './dto/invoice-pdf-params.dto';
import Hashids from 'hashids';
import {
  INVOICE_CREATED_EVENT,
  InvoiceMessageDto,
  WHATSAPP_MESSAGING_SERVICE,
} from '@app/event-patterns';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { pdfGenerator } from './pdfgenerator';
import { CreateInvoiceEventDTO } from '@app/event-patterns/dto/create-invoice.dto';
import { S3Service } from '@app/aws/s3.service';
import { CommandStatus } from '@prisma/client';
@Injectable()
export class InvoicesService {
  private loger = new Logger(InvoicesService.name);
  private invoiceId: number;
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaClient: PrismaService,
    private readonly storageService: S3Service,
    @Inject(WHATSAPP_MESSAGING_SERVICE)
    private readonly whatsappMessagingService: ClientProxy,
  ) {}

  // Générer le chemin S3 basé sur les métadonnées

  async createInvoice(createInvoiceDto: CreateInvoiceEventDTO) {
    this.loger.log('event payload', createInvoiceDto);
    try {
      const command = await this.prismaClient.command.findUnique({
        where: { id: createInvoiceDto.commandId },
      });

      if (!command) {
        throw new BadRequestException(
          `Command with ID ${createInvoiceDto.commandId} not found`,
        );
      }

      const hashIds = new Hashids(
        this.configService.get('CODE_SALT'),
        Number(this.configService.get('CODE_MIN_LENGTH')),
        this.configService.get('CODE_ALPHABET'),
      );

      const invoice = await this.prismaClient.invoice.create({
        data: {
          amountPaid: createInvoiceDto.advance,
          storageStatus: 'PENDING',
          command: {
            connect: {
              id: createInvoiceDto.commandId,
            },
          },
          Agency: {
            connect: {
              id: createInvoiceDto.agencyId,
            },
          },
        },
        select: {
          id: true,
          code: true,
          amountPaid: true,
          createdAt: true,
          command: {
            select: {
              id: true,
              withdrawDate: true,
              code: true,
              discount: true,
              advance: true,
              user: {
                select: {
                  username: true,
                  phone: true,
                },
              },
              Agency: {
                select: {
                  id: true,
                  name: true,
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
                  id: true,
                  name: true,
                  phone: true,
                  address: true,
                },
              },
            },
          },
        },
      });

      if (!invoice) {
        throw new InternalServerErrorException(
          "Erreur lors de l'enregistrement de la facture",
        );
      }

      this.invoiceId = invoice.id;

      //generate invoice code and ensure it is unique
      let code = hashIds.encode(invoice.id);
      let isCodeUnique = false;

      do {
        const invoice = await this.prismaClient.invoice.findUnique({
          where: {
            code,
          },
        });
        this.loger.log('invoice', invoice);
        if (invoice === null) {
          isCodeUnique = false;
        } else {
          code = hashIds.encode(invoice.id);
        }
      } while (isCodeUnique);

      const barcodeBuffer = await this.generateInvoiceBarcode({
        barcodeText: code,
      });
      const params: InvoicePDFParamsDto = {
        barcodeBuffer,
        invoice: invoice,
      };
      const pdfStream: Buffer = (await pdfGenerator(params)) as Buffer;

      if (!pdfStream) {
        throw new InternalServerErrorException(
          'Erreur lors de la génération du pdf',
        );
      }
      const s3Key = await this.storageService.uploadSIngleFile({
        file: pdfStream,
        invoiceCode: code,
        invoiceId: invoice.id,
        invoiceCreatedAt: invoice.createdAt,
        agencyId: invoice.command.Agency.id,
        customerId: invoice.command.customer.id,
        commandId: invoice.command.id,
      });

      const result = await this.prismaClient.invoice.update({
        where: {
          id: invoice.id,
        },
        data: {
          code,
          s3key: s3Key,
          storageStatus: 'UPLOADED',
        },
        include: {
          Agency: true,
          command: true,
        },
      });

      if (createInvoiceDto.isitFirst) {
        const customer = await this.prismaClient.customer.findUnique({
          where: {
            id: result.id,
          },
        });
        if (!customer) {
          throw new BadRequestException(
            'impossible de retrouver le client lié à cette facture',
          );
        }
        await lastValueFrom<InvoiceMessageDto>(
          this.whatsappMessagingService.emit(INVOICE_CREATED_EVENT, {
            invoice_url: result.s3key,
            order_code: result.command.code,
            customer_name: customer.name,
            agency_name: result.Agency.name,
            order_amount: result.amountPaid.toString(),
            order_status: this.getCommandStatus(command.status),
          }),
        );
      }
    } catch (error) {
      this.handleErrorWhenGeneratingInvoice(this.invoiceId);
      this.loger.error('Erreur lors de la génération de la facture:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(
        'Une erreur est survenue lors de la génération de la facture',
      );
    }
  }

  private async handleErrorWhenGeneratingInvoice(invoiceId: number) {
    await this.prismaClient.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        storageStatus: 'ERROR',
      },
    });
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

  private getCommandStatus(status: CommandStatus) {
    switch (status) {
      case 'NOT_PAID':
        return 'À régler';
      case 'PAID':
        return 'Réglée';
      case 'PENDING':
        return 'Avancée';
      default:
        return 'à payer';
    }
  }
}
