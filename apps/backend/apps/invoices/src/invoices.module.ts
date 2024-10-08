import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { RmqModule } from '@app/rmq';
import { WHATSAPP_MESSAGING_SERVICE } from '@app/event-patterns';
import joi from 'joi';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RmqModule.register({
      name: WHATSAPP_MESSAGING_SERVICE,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        RABBIT_MQ_CREATE_INVOICES_SERVICE_QUEUE: joi.string().required(),
      }),
    }),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, PrismaService],
})
export class InvoicesModule {}
