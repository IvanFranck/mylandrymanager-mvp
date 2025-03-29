import { OrderConfirmationTemplateData } from '@app/event-patterns';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import {
  WHATSAPP_API_BASE_URL,
  WHATSAPP_API_VERSION,
  WHATSAPP_ORDER_CONFIRMATION_MESSAGE_TEMPLATE,
} from './constants';

@Injectable()
export class WhatsappMessagingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private readonly logger = new Logger(WhatsappMessagingService.name);

  async sendOrderConfirmationMessage(
    orderConfirmationTemplateData: OrderConfirmationTemplateData,
  ) {
    const phoneNumberId = this.configService.get(
      'WHATSAPP_API_PHONE_NUMBER_ID',
    );
    const messageUrl = `${WHATSAPP_API_BASE_URL}/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`;

    try {
      console.log('send whatsapp message', orderConfirmationTemplateData);
      const data = await firstValueFrom(
        this.httpService
          .post(
            messageUrl,
            {
              messaging_product: 'whatsapp',
              to: '237656488116',
              type: 'template',
              template: {
                name: WHATSAPP_ORDER_CONFIRMATION_MESSAGE_TEMPLATE,
                language: { code: 'FR' },
                components: [
                  {
                    type: 'body',
                    parameters: [
                      {
                        type: 'text',
                        text: orderConfirmationTemplateData.customer_name,
                      },
                      {
                        type: 'text',
                        text: orderConfirmationTemplateData.order_id,
                      },
                      {
                        type: 'text',
                        text: orderConfirmationTemplateData.agency_name,
                      },
                      {
                        type: 'text',
                        text: orderConfirmationTemplateData.services_list,
                      },
                      {
                        type: 'text',
                        text: orderConfirmationTemplateData.order_amount,
                      },
                      {
                        type: 'text',
                        text: orderConfirmationTemplateData.withdrawal_date,
                      },
                    ],
                  },
                ],
              },
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
}
