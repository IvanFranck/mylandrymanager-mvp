import { Body, Controller, Post } from '@nestjs/common';
import { WhatsappMessagingService } from './whatsappmessaging.service';
import { SendWhatsappTextMessageDto } from '../../libs/event-patterns/src/dto/send-message.dto';

@Controller({ path: 'whatsapp-messaging', version: '1' })
export class WhatsappMessagingController {
  constructor(
    private readonly whatsappMessagingService: WhatsappMessagingService,
  ) {}
  @Post('send-message')
  async sendMessage(
    @Body() sendWhatsappTextMessageDto: SendWhatsappTextMessageDto,
  ) {
    await this.whatsappMessagingService.sendMessage(sendWhatsappTextMessageDto);
  }
}
