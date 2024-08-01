import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CommandsController } from './commands.controller';
import { PrismaService } from '@app-backend/prisma.service';
import { InvoicesService } from '@app-backend/invoices/invoices.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'INCOMES_STATS',
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('RMQ_URI')],
              queue: configService.get<string>('RMQ_INCOMES_STATS_QUEUE'),
              noAck: false,
              persistent: true,
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CommandsController],
  providers: [CommandsService, PrismaService, InvoicesService],
})
export class CommandsModule {}
