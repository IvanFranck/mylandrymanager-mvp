import { Module } from '@nestjs/common';
import { AgenciesController } from './agencies.controller';
import { PrismaService } from '@app/prisma';
import { AgenciesService } from './agencies.service';

@Module({
  controllers: [AgenciesController],
  providers: [PrismaService, AgenciesService],
})
export class AgenciesModule {}
