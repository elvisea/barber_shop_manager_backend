import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { EstablishmentEvolutionApiCreateInstanceResponseDTO } from '../dtos/establishment-evolution-api-create-instance-response.dto';

/**
 * Documentação completa do endpoint de criação de instância na Evolution API
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /establishments/:establishmentId/evolution-api/instance
 */
export function CreateEvolutionApiInstanceDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Criar nova instância na Evolution API para o estabelecimento',
      description:
        'Cria uma nova instância na Evolution API para o estabelecimento especificado.',
    }),
    ApiResponse({
      status: 201,
      description: 'Instância criada com sucesso',
      type: EstablishmentEvolutionApiCreateInstanceResponseDTO,
      example: {
        instanceId: 'instance_123456789',
        status: 'active',
        establishmentId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        createdAt: '2023-10-27T10:00:00.000Z',
        updatedAt: '2023-10-27T10:00:00.000Z',
      },
    }),
    ApiBadRequestResponse({
      description: 'Dados inválidos',
      schema: {
        type: 'object',
        example: {
          message: 'Dados inválidos',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Não autorizado',
      schema: {
        type: 'object',
        example: {
          message: 'Não autorizado',
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Estabelecimento não encontrado',
      schema: {
        type: 'object',
        example: {
          message: 'Estabelecimento não encontrado',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Erro interno do servidor',
      schema: {
        type: 'object',
        example: {
          message: 'Erro interno do servidor',
          error: 'Internal Server Error',
          statusCode: 500,
        },
      },
    }),
  );
}
