import { SendWhatsappTextMessageDto } from '@app/event-patterns';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';
import { invoiceMessageTemplate } from './messages-templates';

@Injectable()
export class WhatsappMessagingService {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(WhatsappMessagingService.name);
  private twilioClient: twilio.Twilio = twilio(
    this.configService.get('TWILIO_VERIFY_API_ACCOUNT_SID'),
    this.configService.get('TWILIO_VERIFY_API_AUTH_KEY'),
  );

  async sendMessage(sendWhatsappTextMessageDto: SendWhatsappTextMessageDto) {
    const messagePayloadTemplate = this.getMessagePayloadTemplate(
      sendWhatsappTextMessageDto,
    );
    if (!messagePayloadTemplate) {
      throw new Error('message payload template not found');
    }
    try {
      await this.twilioClient.messages
        .create({
          to: `whatsapp:+237${sendWhatsappTextMessageDto.to}`,
          from: `whatsapp:${this.configService.get('TWILIO_VERIFY_API_PHONE_NUMBER')}`,
          body: messagePayloadTemplate.message,
        })
        .then((message) => {
          console.log('message sent', message);
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      this.logger.error(error);
      throw new Error('sending whatsapp message failed');
    }
  }

  getMessagePayloadTemplate(
    dto: Pick<SendWhatsappTextMessageDto, 'type' | 'invoiceCode'>,
  ) {
    switch (dto.type) {
      case 'invoice':
        return {
          message: invoiceMessageTemplate(
            dto.invoiceCode,
            this.configService.get('INVOICE_BASE_URL'),
          ),
          mediaUrl: [
            `${this.configService.get('INVOICE_BASE_URL')}/${dto.invoiceCode}`,
          ],
        };
      case 'withdraw_reminder':
        return null;
      default:
        return null;
    }
  }
}
