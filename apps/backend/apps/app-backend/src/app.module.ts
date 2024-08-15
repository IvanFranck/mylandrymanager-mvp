import { RmqModule } from '@app/rmq';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { ServicesModule } from './services/services.module';
import { CommandsModule } from './commands/commands.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import joi from 'joi';
import { OTPModule } from './otp/otp.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { InvoicesModule } from './invoices/invoices.module';
import { JwtKeysModule } from './jwtkeys/jwtkeys.module';
import { IncomesModule } from './incomes/incomes.module';

@Module({
  imports: [
    CustomersModule,
    ServicesModule,
    CommandsModule,
    UsersModule,
    IncomesModule,
    AuthModule,
    JwtKeysModule,
    OTPModule,
    InvoicesModule,
    RmqModule.register({
      name: 'INCOMES_STATS_SERVICE',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DATABASE_URL: joi.string().required(),
        PORT: joi.number().required(),
        AXIOS_TIMEOUT: joi.number().required(),
        CODE_ALPHABET: joi.string().required(),
        CODE_SALT: joi.string().required(),
        CODE_MIN_LENGTH: joi.number().required(),
        INVOICES_ROOT_PATH: joi.string().required(),
        COMMAND_BARCODE_ROOT_PATH: joi.string().required(),
        JWT_ALGORITHM: joi.string().required(),
        RABBIT_MQ_INCOMES_STATS_SERVICE_QUEUE: joi.string().required(),
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
