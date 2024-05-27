import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendOTPDto {
  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
