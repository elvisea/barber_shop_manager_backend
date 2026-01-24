import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ValidatePasswordResetTokenRequestDto } from '../dtos';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de validação de token de redefinição de senha
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /auth/password-reset/verify
 */
export function ValidatePasswordResetTokenDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Validar token de redefinição de senha',
      description:
        'Valida se o token de redefinição de senha é válido e não expirou. Deve ser chamado antes de permitir a redefinição da senha.',
    }),
    ApiBody({
      type: ValidatePasswordResetTokenRequestDto,
      examples: {
        example1: {
          summary: 'Exemplo de validação',
          description: 'Exemplo de validação de token',
          value: {
            email: 'usuario@example.com',
            token: '123456',
          },
        },
      },
    }),
    ApiResponse({
      status: 204,
      description: 'Token válido',
    }),
    ApiResponse({
      status: 400,
      description:
        SwaggerErrors[ErrorCode.INVALID_VERIFICATION_TOKEN]?.description ||
        'Token inválido ou expirado',
      schema: {
        example: SwaggerErrors[ErrorCode.INVALID_VERIFICATION_TOKEN]
          ?.example || {
          statusCode: 400,
          message: 'Token inválido ou expirado',
          errorCode: 'INVALID_VERIFICATION_TOKEN',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description:
        SwaggerErrors[ErrorCode.USER_NOT_FOUND]?.description ||
        'Usuário não encontrado',
      schema: {
        example: SwaggerErrors[ErrorCode.USER_NOT_FOUND]?.example || {
          statusCode: 404,
          message: 'Usuário não encontrado',
          errorCode: 'USER_NOT_FOUND',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
  );
}
