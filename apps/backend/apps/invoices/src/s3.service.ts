import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3UploadSingleFileDTO } from './dto/s3-upload-single-file.dto';
import { createReadStream } from 'fs-extra';

@Injectable()
export class S3Service {
  private client: S3Client;
  private bucketName = this.configService.get('S3_BUCKET_NAME');
  constructor(private readonly configService: ConfigService) {
    const s3Region = this.configService.get('S3_REGION');

    this.client = new S3Client({
      region: s3Region,
      forcePathStyle: true,
    });
  }

  async uploadSIngleFile(dto: S3UploadSingleFileDTO) {
    try {
      const fileStream = createReadStream(dto.filePath);
      const command = new PutObjectCommand({
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Key: `${dto.fileKey}.pdf`,
        ContentType: 'pdf',
        Body: fileStream,
        ACL: dto.isPublic ? 'public-read' : 'private',
      });

      const result = await this.client.send(command);
      console.log('result', result);
    } catch (error) {
      console.log(error);
    }
  }
}
