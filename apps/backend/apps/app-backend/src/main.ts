import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { CustomExptionFilter } from '@common-app-backend/filters/custom-exeption.filter';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE_NAME } from './auth/constants';
async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule, {
    logger: ['warn', 'error', 'log'],
  });

  // enabling cors
  nestApp.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers',
    ],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
  });

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

  await nestApp.listen(5555);
}
bootstrap();
