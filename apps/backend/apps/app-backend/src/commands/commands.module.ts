import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CommandsController } from './commands.controller';
import { PrismaService } from '@app/prisma/prisma.service';
import { InvoicesService } from '@app-backend/invoices/invoices.service';

@Module({
  controllers: [CommandsController],
  providers: [CommandsService, PrismaService, InvoicesService],
})
export class CommandsModule {}
