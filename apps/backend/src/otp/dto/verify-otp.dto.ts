import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyOTPDto {
  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
