import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
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
 * Documentação completa do endpoint de atualização de agendamento
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint PUT /appointments/:id
 */
export function UpdateAppointmentDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar agendamento',
      description: 'Atualiza os dados de um agendamento existente.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      description: 'ID único do agendamento (UUID)',
      example: '550e8400-e29b-41d4-a716-446655440000',
      type: String,
    }),
    ApiOkResponse({
      description: 'Agendamento atualizado com sucesso',
      type: AppointmentFindOneResponseDTO,
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        customerId: '550e8400-e29b-41d4-a716-446655440001',
        memberId: '550e8400-e29b-41d4-a716-446655440002',
        establishmentId: '550e8400-e29b-41d4-a716-446655440003',
        startTime: '2025-08-22T14:00:00.000Z',
        endTime: '2025-08-22T15:00:00.000Z',
        notes: 'Corte de cabelo, barba e sobrancelha',
        status: 'CONFIRMED',
        services: [
          {
            serviceId: '550e8400-e29b-41d4-a716-446655440004',
            name: 'Corte de Cabelo',
            price: 25.0,
            duration: 30,
          },
          {
            serviceId: '550e8400-e29b-41d4-a716-446655440005',
            name: 'Barba',
            price: 15.0,
            duration: 20,
          },
        ],
        createdAt: '2025-08-22T00:00:00.000Z',
        updatedAt: '2025-08-22T12:00:00.000Z',
      },
    }),
    ApiBadRequestResponse({
      description: 'Dados inválidos fornecidos',
      schema: {
        oneOf: [
          {
            example: {
              statusCode: 400,
              message: 'ID deve ser um UUID válido',
              error: 'Bad Request',
              errorCode: 'INVALID_UUID',
            },
          },
          {
            example: SwaggerErrors[ErrorCode.APPOINTMENT_INVALID_TIME].example,
          },
        ],
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
      description: 'Agendamento, cliente ou funcionário não encontrado',
      schema: {
        oneOf: [
          {
            example: SwaggerErrors[ErrorCode.APPOINTMENT_NOT_FOUND].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.APPOINTMENT_CUSTOMER_NOT_FOUND].example,
          },
          {
            example: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].example,
          },
        ],
      },
    }),
    ApiConflictResponse({
      description: 'Conflito de horário ou estabelecimento fechado',
      schema: {
        oneOf: [
          {
            example: SwaggerErrors[ErrorCode.APPOINTMENT_CONFLICT].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.APPOINTMENT_ESTABLISHMENT_CLOSED].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.APPOINTMENT_MEMBER_UNAVAILABLE].example,
          },
        ],
      },
    }),
  );
}
