import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigService } from '@nestjs/config';
import { CustomExptionFilter } from '@common/filters/custom-exeption.filter';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE_NAME } from './auth/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error', 'log'],
  });
  const configService = app.get(ConfigService);

  // enabling cors
  app.enableCors();

  // enabling versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // setting up swagger
  const config = new DocumentBuilder()
    .setTitle('My landry API')
    .setDescription('My landry API description')
    .setVersion('1.0')
    .addCookieAuth(ACCESS_TOKEN_COOKIE_NAME)
    .build();

  const document = SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('api', app, document);

  // setting up custom exception global filters
  app.useGlobalFilters(new CustomExptionFilter());

  // setting up cookie parser
  // app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      skipMissingProperties: false,
      skipUndefinedProperties: false,
    }),
  );

  await app.listen(configService.get('PORT'));
}
bootstrap();
