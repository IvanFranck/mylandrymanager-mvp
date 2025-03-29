import {
  BadRequestException,
  ForbiddenException,
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
import { Invoice, InvoiceStorageStatus } from '@prisma/client';
import { CloudFrontService, S3Service } from '@app/aws';
import { S3Client } from '@aws-sdk/client-s3';
@Injectable()
export class InvoicesService {
  private loger = new Logger(InvoicesService.name);
  private bucketName: string;
  private s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaClient: PrismaService,
    private readonly cloudFrontService: CloudFrontService,
    private readonly s3: S3Service,
  ) {
    const s3Region = this.configService.get('AWS_REGION');

    this.s3Client = new S3Client({
      region: s3Region,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = this.configService.get('S3_BUCKET_NAME');
  }

  async getInvoiceUrlForStaff(
    invoiceId: number,
    userId: number,
  ): Promise<string> {
    const invoice = await this.prismaClient.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        Agency: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Facture non trouvée');
    }

    if (invoice.storageStatus !== InvoiceStorageStatus.UPLOADED) {
      throw new NotFoundException('Facture non disponible');
    }

    // Vérifier les droits d'accès de l'utilisateur
    const userAgency = await this.prismaClient.userAgency.findUnique({
      where: {
        userId_agencyId: {
          userId,
          agencyId: invoice.agencyId,
        },
      },
    });

    if (!userAgency) {
      throw new ForbiddenException('Accès non autorisé');
    }

    // Générer une URL signée valable 1 heure pour le staff
    return this.cloudFrontService.generateSignedUrl(invoice.s3key, 60 * 60);
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
        where: { code: filePath },
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
      const pdfFilePath = join(pdfFileRootPath, `${invoice.code}.pdf`);

      return createReadStream(pdfFilePath);
    } catch (error) {
      this.loger.error('Erreur lors de la récupération de la facture:', error);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération de la facture:',
      );
    }
  }

  async getInvoiceByCode(
    invoiceCode: string,
  ): Promise<{ stream: ReadStream; filename: string }> {
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
      const pdfFilePath = join(pdfFileRootPath, `${invoice.code}.pdf`);

      return {
        stream: createReadStream(pdfFilePath),
        filename: invoice.code,
      };
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
