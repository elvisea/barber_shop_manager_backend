import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

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
      const errorObj = errorResponse as {
        message?: string;
        errorCode?: string;
      };
      message = errorObj.message || 'Erro desconhecido';
      errorCode = errorObj.errorCode || '';
    } else {
      message = errorResponse;
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
