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
import { AppointmentStatus } from '@prisma/client';

import { AppointmentFindAllResponseDTO } from '../dtos/api/appointment-find-all-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import {
  getFutureDate,
  getFutureDateTime,
  getPastDate,
} from '@/common/utils/date-helpers';
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
      name: 'userId',
      required: false,
      description: 'Filtrar por ID do usuário/funcionário',
      example: '550e8400-e29b-41d4-a716-446655440002',
      type: String,
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filtrar por status do agendamento',
      example: AppointmentStatus.PENDING,
      enum: AppointmentStatus,
    }),
    ApiQuery({
      name: 'startDate',
      required: false,
      description: 'Data de início para filtro (ISO 8601)',
      example: getPastDate(7),
      type: String,
    }),
    ApiQuery({
      name: 'endDate',
      required: false,
      description: 'Data de fim para filtro (ISO 8601)',
      example: getFutureDate(7),
      type: String,
    }),
    ApiQuery({
      name: 'includeDeleted',
      required: false,
      description:
        'Incluir registros deletados na busca (por padrão, apenas não deletados são retornados)',
      example: false,
      type: Boolean,
    }),
    ApiOkResponse({
      description: 'Lista de agendamentos retornada com sucesso',
      type: AppointmentFindAllResponseDTO,
      example: {
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            customerId: '550e8400-e29b-41d4-a716-446655440001',
            userId: '550e8400-e29b-41d4-a716-446655440002',
            startTime: getFutureDateTime(1, 10, 0),
            endTime: getFutureDateTime(1, 11, 0),
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: {
            items: 1,
            pages: 1,
          },
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
