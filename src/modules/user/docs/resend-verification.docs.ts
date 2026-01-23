import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ResendVerificationResponseDto } from '../dtos/resend-verification-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de reenvio de código de verificação
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /users/email-verification/resend
 */
export function ResendVerificationDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Resend verification code',
      description:
        'Reenvia um novo código de verificação para o email do usuário.',
    }),
    ApiResponse({
      status: 200,
      type: ResendVerificationResponseDto,
      description: 'Novo código de verificação enviado com sucesso',
    }),
    ApiResponse({
      status: 404,
      description: SwaggerErrors[ErrorCode.USER_NOT_FOUND].description,
      schema: { example: SwaggerErrors[ErrorCode.USER_NOT_FOUND].example },
    }),
    ApiResponse({
      status: 409,
      description: SwaggerErrors[ErrorCode.EMAIL_ALREADY_VERIFIED].description,
      schema: {
        example: SwaggerErrors[ErrorCode.EMAIL_ALREADY_VERIFIED].example,
      },
    }),
    ApiResponse({
      status: 400,
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
  );
}
