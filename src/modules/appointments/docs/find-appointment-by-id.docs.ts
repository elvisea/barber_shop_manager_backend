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

import { AppointmentFindOneResponseDTO } from '../dtos/api/appointment-find-one-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { getFutureDateTime, getPastDate } from '@/common/utils/date-helpers';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de busca de agendamento por ID
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /establishments/{establishmentId}/appointments/{appointmentId}
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
      name: 'establishmentId',
      description: 'ID único do estabelecimento',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiParam({
      name: 'appointmentId',
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
        startTime: getFutureDateTime(1, 10, 0),
        endTime: getFutureDateTime(1, 11, 0),
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
        createdAt: getPastDate(1),
        updatedAt: getPastDate(1),
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
