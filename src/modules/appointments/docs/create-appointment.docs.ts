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

import { AppointmentCreateResponseDTO } from '../dtos/api/appointment-create-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { getCurrentDate, getFutureDateTime } from '@/common/utils/date-helpers';
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
        userId: '550e8400-e29b-41d4-a716-446655440002',
        establishmentId: '550e8400-e29b-41d4-a716-446655440003',
        startTime: getFutureDateTime(1, 10, 0),
        endTime: getFutureDateTime(1, 11, 0),
        totalAmount: 5000,
        totalDuration: 60,
        status: 'PENDING',
        notes: 'Corte de cabelo e barba',
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate(),
      },
    }),
    ApiBadRequestResponse({
      description: 'Dados inválidos fornecidos ou validação de negócio falhou',
      schema: {
        oneOf: [
          {
            example: SwaggerErrors[ErrorCode.INVALID_TIME_RANGE].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.APPOINTMENT_START_TIME_IN_PAST].example,
          },
          {
            example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example,
          },
        ],
      },
    }),
    ApiConflictResponse({
      description:
        'Conflito de horários - membro já possui agendamento no período',
      schema: {
        example: SwaggerErrors[ErrorCode.MEMBER_APPOINTMENT_CONFLICT].example,
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
      description:
        'Acesso negado - usuário não tem permissão para criar agendamentos',
      schema: {
        oneOf: [
          {
            example:
              SwaggerErrors[ErrorCode.USER_NOT_MEMBER_OF_ESTABLISHMENT].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.APPOINTMENT_SERVICE_NOT_AVAILABLE]
                .example,
          },
        ],
      },
    }),
    ApiNotFoundResponse({
      description: 'Recurso não encontrado',
      schema: {
        oneOf: [
          {
            example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND].example,
          },
          {
            example: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND].example,
          },
        ],
      },
    }),
  );
}
