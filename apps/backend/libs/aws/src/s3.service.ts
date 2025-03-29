import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { S3UploadSingleFileDTO } from './dto/s3-upload-single-file.dto';
import { format } from 'date-fns';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private loger = new Logger(S3Service.name);
  constructor(private readonly configService: ConfigService) {
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

  // Fonction utilitaire pour convertir un stream en buffer
  private async streamToBuffer(
    stream: AsyncIterable<Uint8Array> | ReadableStream,
  ): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
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

      const result = await this.s3Client.send(command);
      if (result.$metadata.httpStatusCode !== 200) {
        throw new Error("Erreur lors de l'upload du fichier dans le bucket s3");
      }
      return s3Key;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Génère une URL signée pour accéder à un objet S3
   */
  async generateSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Récupère un fichier depuis S3
   */
  async getFile(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    if (response.Body instanceof Blob) {
      return await this.streamToBuffer(response.Body.stream());
    }
    throw new Error('Unsupported response body type');
  }
}
