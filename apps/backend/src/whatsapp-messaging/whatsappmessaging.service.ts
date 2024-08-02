import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { SendWhatsappTextMessageDto } from '../../libs/event-patterns/src/dto/send-message.dto';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

@Injectable()
export class WhatsappMessagingService {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(WhatsappMessagingService.name);
  private twilioClient: twilio.Twilio = twilio(
    this.configService.get('TWILIO_VERIFY_API_ACCOUNT_SID'),
    this.configService.get('TWILIO_VERIFY_API_AUTH_KEY'),
  );

  async sendMessage(sendWhatsappTextMessageDto: SendWhatsappTextMessageDto) {
    try {
      let result: MessageInstance | null = null;
      await this.twilioClient.messages
        .create({
          to: `whatsapp:${sendWhatsappTextMessageDto.to}`,
          from: `whatsapp:${this.configService.get('TWILIO_VERIFY_API_PHONE_NUMBER')}`,
          body: sendWhatsappTextMessageDto.message,
        })
        .then((message) => {
          console.log('message sent', message);
          result = message;
        })
        .catch((error) => {
          throw new Error(error);
        });

      if (result) {
        return result;
      }
    } catch (error) {
      this.logger.error(error);
      throw new Error('sending whatsapp message failed');
    }
  }
}
