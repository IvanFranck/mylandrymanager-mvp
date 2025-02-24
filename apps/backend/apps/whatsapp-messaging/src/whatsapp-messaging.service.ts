import { SendWhatsappTextMessageDto } from '@app/event-patterns';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { invoiceMessageTemplate } from './messages-templates';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class WhatsappMessagingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private readonly logger = new Logger(WhatsappMessagingService.name);

  async sendMessage(sendWhatsappTextMessageDto: SendWhatsappTextMessageDto) {
    const messagePayloadTemplate = this.getMessagePayloadTemplate(
      sendWhatsappTextMessageDto,
    );
    const messageUrl = `"https://graph.facebook.com/${this.configService.get('WHATSAPP_API_VERSION')}/${this.configService.get('WHATSAPP_API_PHONE_NUMBER_ID')}"/messages`;
    if (!messagePayloadTemplate) {
      throw new Error('message payload template not found');
    }
    try {
      console.log('send whatsapp message', sendWhatsappTextMessageDto);
      const data = await firstValueFrom(
        this.httpService
          .post(
            messageUrl,
            {
              messaging_product: 'whatsapp',
              to: '237656488116',
              type: 'template',
              template: { name: 'hello_world', language: { code: 'en_US' } },
            },
            {
              headers: {
                Authorization: `Bearer ${this.configService.get('WHATSAPP_API_TOKEN')}`,
                'Content-Type': 'application/json',
              },
            },
          )
          .pipe(
            catchError((error) => {
              this.logger.error(error.response.data);
              throw 'An error happened!';
            }),
          ),
      );
      console.log('response', data);
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
