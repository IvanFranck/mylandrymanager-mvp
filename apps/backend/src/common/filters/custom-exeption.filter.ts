import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ResponseErrorInterface } from '../interfaces/response-error.interface';
import { Request, Response } from 'express';

@Catch()
export class CustomExptionFilter implements ExceptionFilter {
  catch(error: ResponseErrorInterface, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorName =
      error instanceof HttpException ? error.name : 'Internal Server Error';

    response.status(status).json({
      status: status,
      message: error.message,
      error: errorName,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
