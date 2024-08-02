import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { createReadStream, ReadStream } from 'fs-extra';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { PrismaService } from '@app/prisma/prisma.service';
import { CustomResponseInterface } from '@common-app-backend/interfaces/response.interface';
import { Invoice } from '@prisma/client';
@Injectable()
export class InvoicesService {
  private loger = new Logger(InvoicesService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaClient: PrismaService,
  ) {}

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

  private getFileSubPath(rootPath: string, date?: Date) {
    if (date) {
      return join(rootPath, `${dayjs(date).format('YYYY/MM')}/`);
    }
    return join(rootPath, `${dayjs().format('YYYY/MM')}/`);
  }
}
