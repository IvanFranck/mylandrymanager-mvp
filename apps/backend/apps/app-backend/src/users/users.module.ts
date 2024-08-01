import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '@app-backend/prisma.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
