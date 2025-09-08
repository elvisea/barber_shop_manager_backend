import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de exclusão de agendamento
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint DELETE /appointments/:id
 */
export function DeleteAppointmentDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Excluir agendamento',
      description: 'Remove um agendamento do sistema permanentemente.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      description: 'ID único do agendamento (UUID)',
      example: '550e8400-e29b-41d4-a716-446655440000',
      type: String,
    }),
    ApiNoContentResponse({
      description: 'Agendamento excluído com sucesso',
    }),
    ApiBadRequestResponse({
      description: 'ID inválido fornecido',
      schema: {
        example: {
          statusCode: 400,
          message: 'ID deve ser um UUID válido',
          error: 'Bad Request',
          errorCode: 'INVALID_UUID',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Token de autenticação inválido ou ausente',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Acesso negado ao agendamento',
      schema: {
        example:
          SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].example,
      },
    }),
    ApiNotFoundResponse({
      description: 'Agendamento não encontrado',
      schema: {
        example: SwaggerErrors[ErrorCode.APPOINTMENT_NOT_FOUND].example,
      },
    }),
  );
}
