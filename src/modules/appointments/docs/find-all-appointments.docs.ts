import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AppointmentFindAllResponseDTO } from '../dtos/appointment-find-all-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de listagem de agendamentos
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /appointments
 */
export function FindAllAppointmentsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar agendamentos',
      description:
        'Lista todos os agendamentos com paginação e filtros opcionais.',
    }),
    ApiBearerAuth(),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Número da página para paginação',
      example: 1,
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Número de itens por página',
      example: 10,
      type: Number,
    }),
    ApiQuery({
      name: 'customerId',
      required: false,
      description: 'Filtrar por ID do cliente',
      example: '550e8400-e29b-41d4-a716-446655440001',
      type: String,
    }),
    ApiQuery({
      name: 'memberId',
      required: false,
      description: 'Filtrar por ID do funcionário',
      example: '550e8400-e29b-41d4-a716-446655440002',
      type: String,
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filtrar por status do agendamento',
      example: 'SCHEDULED',
      enum: [
        'SCHEDULED',
        'CONFIRMED',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED',
        'NO_SHOW',
      ],
    }),
    ApiQuery({
      name: 'startDate',
      required: false,
      description: 'Data de início para filtro (ISO 8601)',
      example: '2025-08-22T00:00:00.000Z',
      type: String,
    }),
    ApiQuery({
      name: 'endDate',
      required: false,
      description: 'Data de fim para filtro (ISO 8601)',
      example: '2025-08-22T23:59:59.999Z',
      type: String,
    }),
    ApiOkResponse({
      description: 'Lista de agendamentos retornada com sucesso',
      type: AppointmentFindAllResponseDTO,
      example: {
        data: [
          {
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
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Parâmetros de consulta inválidos',
      schema: {
        example: {
          statusCode: 400,
          message: 'Validation failed',
          error: 'Bad Request',
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
      description: 'Acesso negado ao estabelecimento',
      schema: {
        example:
          SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].example,
      },
    }),
    ApiNotFoundResponse({
      description: 'Estabelecimento não encontrado',
      schema: {
        example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].example,
      },
    }),
  );
}
