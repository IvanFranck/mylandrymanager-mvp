import { NestFactory } from '@nestjs/core';
import { IncomesStatsModule } from './incomes-stats.module';

async function bootstrap() {
  const app = await NestFactory.create(IncomesStatsModule);
  await app.listen(3000);
}
bootstrap();
