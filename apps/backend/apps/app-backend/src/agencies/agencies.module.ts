import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { AgenciesService } from './agencies.service';

@Module({
  providers: [PrismaService, AgenciesService],
})
export class AgenciesModule {}
