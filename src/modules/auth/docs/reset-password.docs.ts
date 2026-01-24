import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ResetPasswordRequestDto } from '../dtos';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de redefinição de senha
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /auth/password-reset/confirm
 */
export function ResetPasswordDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Redefinir senha',
      description:
        'Redefine a senha do usuário usando o token válido. Após a redefinição, todos os refresh tokens do usuário são invalidados (logout de todos os dispositivos).',
    }),
    ApiBody({
      type: ResetPasswordRequestDto,
      examples: {
        example1: {
          summary: 'Exemplo de redefinição',
          description: 'Exemplo de redefinição de senha',
          value: {
            email: 'usuario@example.com',
            token: '123456',
            newPassword: 'NovaSenh@123',
            confirmPassword: 'NovaSenh@123',
          },
        },
      },
    }),
    ApiResponse({
      status: 204,
      description: 'Senha redefinida com sucesso',
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
