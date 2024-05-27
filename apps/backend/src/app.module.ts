import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { ServicesModule } from './services/services.module';
import { CommandsModule } from './commands/commands.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { OTPModule } from './otp/otp.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [
    CustomersModule,
    ServicesModule,
    CommandsModule,
    UsersModule,
    AuthModule,
    OTPModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DATABASE_URL: joi.string().required(),
        PORT: joi.number().required(),
        AXIOS_TIMEOUT: joi.number().required(),
        TWILIO_VERIFY_API_BASE_URL: joi.string().required(),
        TWILIO_VERIFY_API_ACCOUNT_SID: joi.string().required(),
        TWILIO_VERIFY_API_AUTH_KEY: joi.string().required(),
        TWILIO_VERIFY_API_SERVICE_ID: joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
