import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CommandsController } from './commands.controller';
import { PrismaService } from '@app/prisma/prisma.service';
import { InvoicesService } from '@app-backend/invoices/invoices.service';
import { RmqModule } from '@app/rmq';
import { INCOMES_STATS_SERVICE } from '@app/event-patterns';

@Module({
  imports: [
    RmqModule.register({
      name: INCOMES_STATS_SERVICE,
    }),
  ],
  controllers: [CommandsController],
  providers: [CommandsService, PrismaService, InvoicesService],
})
export class CommandsModule {}
