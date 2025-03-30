import {
  InvoiceMessageDto,
  OrderConfirmationTextMessageDto,
} from '@app/event-patterns';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import {
  WHATSAPP_API_BASE_URL,
  WHATSAPP_API_VERSION,
  WHATSAPP_INVOICE_MESSAGE_TEMPLATE,
  WHATSAPP_ORDER_CONFIRMATION_MESSAGE_TEMPLATE,
} from './constants';

@Injectable()
export class WhatsappMessagingService {
  private messageUrl: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const phoneNumberId = this.configService.get(
      'WHATSAPP_API_PHONE_NUMBER_ID',
    );

    this.messageUrl = `${WHATSAPP_API_BASE_URL}/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`;
  }

  private readonly logger = new Logger(WhatsappMessagingService.name);

  async sendOrderConfirmationMessage(
    orderConfirmationTemplateData: OrderConfirmationTextMessageDto,
  ) {
    try {
      console.log('send whatsapp message', orderConfirmationTemplateData);
      const data = await firstValueFrom(
        this.httpService
          .post(
            this.messageUrl,
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
      throw new Error('sending order creation whatsapp message failed');
    }
  }

  async sendInvoiceMessage(invoiceMessageDto: InvoiceMessageDto) {
    try {
      this.logger.log('send invoice whatsapp message', invoiceMessageDto);
      const data = await firstValueFrom(
        this.httpService
          .post(
            this.messageUrl,
            {
              messaging_product: 'whatsapp',
              to: '237656488116',
              type: 'template',
              template: {
                name: WHATSAPP_INVOICE_MESSAGE_TEMPLATE,
                language: { code: 'FR' },
                components: [
                  {
                    type: 'header',
                    parameters: [
                      {
                        type: 'image',
                        image: {
                          link: invoiceMessageDto.invoice_url,
                        },
                      },
                    ],
                  },
                  {
                    type: 'body',
                    parameters: [
                      {
                        type: 'text',
                        text: invoiceMessageDto.customer_name,
                      },
                      {
                        type: 'text',
                        text: invoiceMessageDto.order_code,
                      },
                      {
                        type: 'text',
                        text: invoiceMessageDto.agency_name,
                      },
                      {
                        type: 'text',
                        text: invoiceMessageDto.order_amount,
                      },
                      {
                        type: 'text',
                        text: invoiceMessageDto.order_status,
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
      throw new Error('sending invoice whatsapp message failed');
    }
  }
}
