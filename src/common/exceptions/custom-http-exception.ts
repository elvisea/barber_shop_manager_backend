import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorCode } from '@/enums/error-code';

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
