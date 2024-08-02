import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { RmqModule } from '@app/rmq';
import { WHATSAPP_MESSAGING_SERVICE } from '@app/event-patterns';

@Module({
  imports: [
    RmqModule.register({
      name: WHATSAPP_MESSAGING_SERVICE,
    }),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, PrismaService],
})
export class InvoicesModule {}
