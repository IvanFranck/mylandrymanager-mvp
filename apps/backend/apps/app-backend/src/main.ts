import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigService } from '@nestjs/config';
import { CustomExptionFilter } from '@common-app-backend/filters/custom-exeption.filter';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE_NAME } from './auth/constants';
import * as AWSXRay from 'aws-xray-sdk';
import * as express from 'express';
async function bootstrap() {
  const app = express.default();
  AWSXRay.express.openSegment('MyLaundryAPI');

  const nestApp = await NestFactory.create(AppModule, {
    logger: ['warn', 'error', 'log'],
  });
  const configService = nestApp.get(ConfigService);

  const authorizedOriginsEnv = configService.get<string | undefined>(
    'AUTHORIZED_ORIGINS',
  );

  const authorizedOrigins = authorizedOriginsEnv
    ? authorizedOriginsEnv.split(',')
    : [];

  // enabling cors
  nestApp.enableCors({
    origin: authorizedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Allow-Credentials',
    ],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
  });

  // Ajouter le middleware X-Ray
  app.use(AWSXRay.express.openSegment('MyLaundryAPI'));

  // enabling versioning
  nestApp.enableVersioning({
    type: VersioningType.URI,
  });

  // setting up swagger
  const config = new DocumentBuilder()
    .setTitle('My landry API')
    .setDescription('My landry API description')
    .setVersion('1.0')
    .addCookieAuth(ACCESS_TOKEN_COOKIE_NAME)
    .build();

  const document = SwaggerModule.createDocument(nestApp, config, {});
  SwaggerModule.setup('api', nestApp, document);

  // setting up custom exception global filters
  nestApp.useGlobalFilters(new CustomExptionFilter());

  // setting up cookie parser
  // app.use(cookieParser());

  nestApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      skipMissingProperties: false,
      skipUndefinedProperties: false,
    }),
  );

  await nestApp.listen(configService.get('PORT'));

  app.use(AWSXRay.express.closeSegment());
}
bootstrap();
