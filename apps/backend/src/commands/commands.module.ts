import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CommandsController } from './commands.controller';
import { PrismaService } from 'src/prisma.service';
import { InvoicesService } from '@/invoices/invoices.service';

@Module({
  controllers: [CommandsController],
  providers: [CommandsService, PrismaService, InvoicesService],
})
export class CommandsModule {}
