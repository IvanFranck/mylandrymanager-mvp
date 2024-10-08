import { Module } from '@nestjs/common';
import { OTPService } from './otp.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { OTPController } from './otp.controller';

@Module({
  controllers: [OTPController],
  providers: [OTPService, PrismaService],
})
export class OTPModule {}
