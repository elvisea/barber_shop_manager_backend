import { ErrorCode } from '@/enums/error-code';
import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, errorCode: ErrorCode) {
    const response = {
      message,
      error: HttpStatus[statusCode],
      statusCode,
      errorCode,
    };
    super(response, statusCode);
  }
}
