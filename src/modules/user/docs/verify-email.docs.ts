import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { VerifyEmailResponseDto } from '../dtos/verify-email-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de verificação de email
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /users/email-verification/verify
 */
export function VerifyEmailDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verify user email',
      description:
        'Verifica o email do usuário usando o código de verificação enviado por email.',
    }),
    ApiResponse({
      status: 200,
      type: VerifyEmailResponseDto,
      description: 'Email verificado com sucesso',
    }),
    ApiResponse({
      status: 400,
      description:
        SwaggerErrors[ErrorCode.INVALID_VERIFICATION_TOKEN].description,
      schema: {
        example: SwaggerErrors[ErrorCode.INVALID_VERIFICATION_TOKEN].example,
      },
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
