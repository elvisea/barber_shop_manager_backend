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

import { AppointmentCreateResponseDTO } from '../dtos/api/appointment-create-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import {
  getCurrentDate,
  getPastDate,
  getFutureDateTime,
} from '@/common/utils/date-helpers';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de atualização de agendamento
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint PUT /establishments/{establishmentId}/appointments/{appointmentId}
 */
export function UpdateAppointmentDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar agendamento',
      description: 'Atualiza os dados de um agendamento existente.',
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
      description: 'Agendamento atualizado com sucesso',
      type: AppointmentCreateResponseDTO,
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        establishmentId: '550e8400-e29b-41d4-a716-446655440003',
        customerId: '550e8400-e29b-41d4-a716-446655440001',
        customerName: 'João Silva',
        userId: '550e8400-e29b-41d4-a716-446655440002',
        memberName: 'Maria Santos',
        startTime: getFutureDateTime(1, 14, 0),
        endTime: getFutureDateTime(1, 15, 0),
        totalAmount: 6500,
        totalDuration: 50,
        status: 'CONFIRMED',
        notes: 'Corte de cabelo, barba e sobrancelha',
        createdAt: getPastDate(1),
        updatedAt: getCurrentDate(),
        services: [
          {
            serviceId: '550e8400-e29b-41d4-a716-446655440004',
            price: 5000,
            duration: 30,
            commission: 0.5,
          },
          {
            serviceId: '550e8400-e29b-41d4-a716-446655440005',
            price: 1500,
            duration: 20,
            commission: 0.5,
          },
        ],
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
