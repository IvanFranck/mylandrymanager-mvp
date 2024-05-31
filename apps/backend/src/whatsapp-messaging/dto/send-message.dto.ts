import { IsString } from 'class-validator';

export class SendWhatsappTextMessageDto {
  @IsString()
  message: string;

  @IsString()
  to: string;
}
