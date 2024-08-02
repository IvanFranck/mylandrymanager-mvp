import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject('INCOMES_STATS_SERVICE') private client: ClientProxy) {}
  async getHello() {
    await lastValueFrom(
      this.client.emit('test_event', {
        message: 'hello',
        data: 1,
        timestamp: new Date(),
      }),
    ).catch((error) => {
      console.log('error', error);
    });
    return 'Hello World!';
  }
}
