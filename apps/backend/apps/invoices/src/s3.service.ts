import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3UploadSingleFileDTO } from './dto/s3-upload-single-file.dto';
import { format } from 'date-fns';
@Injectable()
export class S3Service {
  private client: S3Client;
  private loger = new Logger(S3Service.name);
  constructor(private readonly configService: ConfigService) {
    const s3Region = this.configService.get('AWS_REGION');

    this.client = new S3Client({
      region: s3Region,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  private generateS3Key(
    invoiceCreatedAt: Date,
    agencyId: number,
    invoiceCode: string,
  ): string {
    const date = new Date(invoiceCreatedAt);
    const year = date.getFullYear();
    const month = format(date, 'MM');
    const day = format(date, 'dd');

    return `agencies/${agencyId}/${year}/${month}/${day}/invoices/${invoiceCode}.pdf`;
  }

  async uploadSIngleFile(dto: S3UploadSingleFileDTO) {
    const s3Key = this.generateS3Key(
      dto.invoiceCreatedAt,
      dto.agencyId,
      dto.invoiceCode,
    );

    try {
      const command = new PutObjectCommand({
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Key: s3Key,
        ContentType: 'application/pdf',
        Body: dto.file,
        Metadata: {
          'invoice-id': dto.invoiceId.toString(),
          'command-id': dto.commandId.toString(),
          'agency-id': dto.agencyId.toString(),
          'customer-id': dto.customerId.toString(),
        },
        ServerSideEncryption: 'AES256',
      });

      const result = await this.client.send(command);
      if (result.$metadata.httpStatusCode !== 200) {
        throw new Error("Erreur lors de l'upload du fichier dans le bucket s3");
      }
      return s3Key;
    } catch (error) {
      throw error;
    }
  }
}
