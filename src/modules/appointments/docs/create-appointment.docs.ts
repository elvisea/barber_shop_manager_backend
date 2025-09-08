import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AppointmentCreateResponseDTO } from '../dtos/appointment-create-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de criação de agendamento
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /establishments/{establishmentId}/appointments
 */
export function CreateAppointmentDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Criar novo agendamento',
      description:
        'Cria um novo agendamento para um cliente em um estabelecimento específico.',
    }),
    ApiParam({
      name: 'establishmentId',
      description: 'ID único do estabelecimento',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse({
      description: 'Agendamento criado com sucesso',
      type: AppointmentCreateResponseDTO,
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        customerId: '550e8400-e29b-41d4-a716-446655440001',
        memberId: '550e8400-e29b-41d4-a716-446655440002',
        establishmentId: '550e8400-e29b-41d4-a716-446655440003',
        startTime: '2025-08-22T10:00:00.000Z',
        endTime: '2025-08-22T11:00:00.000Z',
        notes: 'Corte de cabelo e barba',
        status: 'SCHEDULED',
        createdAt: '2025-08-22T00:00:00.000Z',
        updatedAt: '2025-08-22T00:00:00.000Z',
      },
    }),
    ApiBadRequestResponse({
      description: 'Dados inválidos fornecidos',
      schema: {
        example: SwaggerErrors[ErrorCode.APPOINTMENT_INVALID_TIME].example,
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
      description: 'Acesso negado ao estabelecimento',
      schema: {
        example:
          SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].example,
      },
    }),
    ApiNotFoundResponse({
      description: 'Cliente ou funcionário não encontrado',
      schema: {
        oneOf: [
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
