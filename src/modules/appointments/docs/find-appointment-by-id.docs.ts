import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AppointmentFindOneResponseDTO } from '../dtos/appointment-find-one-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de busca de agendamento por ID
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /appointments/:id
 */
export function FindAppointmentByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar agendamento por ID',
      description:
        'Retorna os dados de um agendamento específico baseado no ID fornecido.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      description: 'ID único do agendamento (UUID)',
      example: '550e8400-e29b-41d4-a716-446655440000',
      type: String,
    }),
    ApiOkResponse({
      description: 'Agendamento encontrado com sucesso',
      type: AppointmentFindOneResponseDTO,
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        customerId: '550e8400-e29b-41d4-a716-446655440001',
        memberId: '550e8400-e29b-41d4-a716-446655440002',
        establishmentId: '550e8400-e29b-41d4-a716-446655440003',
        startTime: '2025-08-22T10:00:00.000Z',
        endTime: '2025-08-22T11:00:00.000Z',
        notes: 'Corte de cabelo e barba',
        status: 'SCHEDULED',
        services: [
          {
            serviceId: '550e8400-e29b-41d4-a716-446655440004',
            name: 'Corte de Cabelo',
            price: 25.0,
            duration: 30,
          },
        ],
        createdAt: '2025-08-22T00:00:00.000Z',
        updatedAt: '2025-08-22T00:00:00.000Z',
      },
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
