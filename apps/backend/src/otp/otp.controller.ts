import { Body, Controller, Post } from '@nestjs/common';
import { OTPService } from './otp.service';
import { SendOTPDto } from './dto/send-otp.dto';
import { VerifyOTPDto } from './dto/verify-otp.dto';

@Controller({
  path: 'otp',
  version: '1',
})
export class OTPController {
  constructor(private readonly otpService: OTPService) {}

  @Post('send_code')
  async sendCode(@Body() sendCodeDto: SendOTPDto) {
    return await this.otpService.sendOTPSMS(sendCodeDto);
  }

  @Post('verify_code')
  async verifCode(@Body() verifyCodeDto: VerifyOTPDto) {
    return await this.otpService.verifyOTP(verifyCodeDto);
  }
}
