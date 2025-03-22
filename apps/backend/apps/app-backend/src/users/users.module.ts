import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { UsersController } from './users.controller';
import { AgenciesService } from '@app-backend/agencies/agencies.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AgenciesService, PrismaService],
})
export class UsersModule {}
