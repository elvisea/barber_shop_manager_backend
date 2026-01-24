import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { RequestPasswordResetRequestDto } from '../dtos';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de solicitação de redefinição de senha
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /auth/password-reset
 */
export function RequestPasswordResetDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Solicitar redefinição de senha',
      description:
        'Solicita um código de redefinição de senha por email. Por segurança, sempre retorna sucesso mesmo se o email não estiver cadastrado.',
    }),
    ApiBody({
      type: RequestPasswordResetRequestDto,
      examples: {
        example1: {
          summary: 'Exemplo de solicitação',
          description: 'Exemplo de requisição de redefinição de senha',
          value: {
            email: 'usuario@example.com',
          },
        },
      },
    }),
    ApiResponse({
      status: 204,
      description: 'Solicitação processada com sucesso',
    }),
    ApiResponse({
      status: 400,
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
  );
}
