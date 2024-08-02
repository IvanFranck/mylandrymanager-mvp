import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CommandsController } from './commands.controller';
import { PrismaService } from '@app/prisma/prisma.service';
import { RmqModule } from '@app/rmq';
import {
  CREATE_INVOICES_SERVICE,
  INCOMES_STATS_SERVICE,
} from '@app/event-patterns';

@Module({
  imports: [
    RmqModule.register({
      name: INCOMES_STATS_SERVICE,
    }),
    RmqModule.register({
      name: CREATE_INVOICES_SERVICE,
    }),
  ],
  controllers: [CommandsController],
  providers: [CommandsService, PrismaService],
})
export class CommandsModule {}
