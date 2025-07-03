import { Response } from 'express';

import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    let message = '';
    let errorCode = '';

    // Se a resposta for um objeto (como em CustomHttpException), podemos extrair os dados
    if (typeof errorResponse === 'object' && errorResponse !== null) {
      message = (errorResponse as any).message || 'Erro desconhecido';
      errorCode = (errorResponse as any).errorCode || '';
    } else {
      message = errorResponse as string;
    }

    // Formatar a resposta com statusCode, message, error, e errorCode
    response.status(status).json({
      statusCode: status,
      message,
      error: HttpStatus[status],
      errorCode,
    });
  }
}
