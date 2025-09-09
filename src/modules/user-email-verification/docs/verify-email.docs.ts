import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UserEmailVerificationVerifyResponseDTO } from '../dtos';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de verificação de email
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /user-email-verification/verify
 */
export function VerifyEmailDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Verificar email do usuário com código' }),
    ApiResponse({
      status: 200,
      description: 'Email verificado com sucesso',
      type: UserEmailVerificationVerifyResponseDTO,
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
      status: 400,
      description:
        SwaggerErrors[ErrorCode.VERIFICATION_TOKEN_EXPIRED].description,
      schema: {
        example: SwaggerErrors[ErrorCode.VERIFICATION_TOKEN_EXPIRED].example,
      },
    }),
    ApiResponse({
      status: 409,
      description: SwaggerErrors[ErrorCode.EMAIL_ALREADY_VERIFIED].description,
      schema: {
        example: SwaggerErrors[ErrorCode.EMAIL_ALREADY_VERIFIED].example,
      },
    }),
  );
}
