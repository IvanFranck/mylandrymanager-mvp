import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { CloudFrontService, S3Service } from '@app/aws';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, PrismaService, CloudFrontService, S3Service],
})
export class InvoicesModule {}
