import {
  BadRequestException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SendOTPDto } from './dto/send-otp.dto';
import * as twilio from 'twilio';
import { ConfigService } from '@nestjs/config';
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';
import { VerifyOTPDto } from './dto/verify-otp.dto';
import { PrismaService } from 'src/prisma.service';
import { VerifyOTPEntity } from './entities/verify-otp.entity';
import { OTP_CHANNEL } from './constants';

@Injectable()
export class OTPService {
  private readonly logger = new Logger(OTPService.name);
  private twilioClient: twilio.Twilio = twilio(
    this.configService.get('TWILIO_VERIFY_API_ACCOUNT_SID'),
    this.configService.get('TWILIO_VERIFY_API_AUTH_KEY'),
  );
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async sendOTPSMS(
    sendOTPDto: SendOTPDto,
  ): Promise<{ message: string; data: VerificationInstance }> {
    const { userId, to } = sendOTPDto;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
        signUpCompleted: false,
      },
    });

    if (!user) {
      throw new BadRequestException('user not found');
    }

    const data = await this.twilioClient.verify.v2
      .services(this.configService.get('TWILIO_VERIFY_API_SERVICE_ID'))
      .verifications.create({
        channel: OTP_CHANNEL,
        to,
      })
      .catch((error) => {
        this.logger.error(error);
        if (error.code === 60200)
          throw new UnprocessableEntityException('informations incorrectes');
        throw new Error(error);
      });

    if (data.status === 'pending') {
      return {
        message: 'verification code send',
        data,
      };
    } else {
      this.logger.error(data);
      throw new Error('sending phone number verification code failed');
    }
  }

  /**
   * async function to verify OTP
   *
   * @param {VerifyOTPDto} verifyOTPDto - DTO for OTP verification
   * @return {Promise<VerifyOTPEntity>} Promise that resolves to VerifyOTPEntity
   */
  async verifyOTP(verifyOTPDto: VerifyOTPDto): Promise<VerifyOTPEntity> {
    const { userId, code, to } = verifyOTPDto;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
        // signUpCompleted: false,    gérer le cas où le user phone est déjà vérifié
      },
    });

    if (!user) {
      throw new BadRequestException('user not found');
    }

    const data = await this.twilioClient.verify.v2
      .services(this.configService.get('TWILIO_VERIFY_API_SERVICE_ID'))
      .verificationChecks.create({ code, to })
      .catch((error) => {
        this.logger.error('erro when verifing code' + error);
        throw new UnprocessableEntityException("can't verify this code");
      });
    this.logger.log('code verification data: ' + data);
    if (data.status === 'approved') {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          signUpCompleted: true,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          phone: true,
          signUpCompleted: true,
          username: true,
        },
      });
      return {
        message: 'phone number verified',
        user,
        data,
      };
    } else {
      this.logger.error(data);
      throw new Error('phone number verification failed');
    }
  }
}
