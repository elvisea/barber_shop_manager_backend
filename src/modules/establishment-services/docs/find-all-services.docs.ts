import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { EstablishmentServiceFindAllResponseDTO } from '../dtos/establishment-service-find-all-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de busca de todos os serviços
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /establishments/:establishmentId/services
 */
export function FindAllServicesDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Find all services (paginated)',
      description:
        'Busca todos os serviços de um estabelecimento com paginação.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de serviços encontrada com sucesso',
      type: EstablishmentServiceFindAllResponseDTO,
      example: {
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Corte de Cabelo',
            description: 'Corte de cabelo masculino',
            price: 50.0,
            duration: 60,
            establishmentId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            createdAt: '2023-10-27T10:00:00.000Z',
            updatedAt: '2023-10-27T10:00:00.000Z',
          },
          {
            id: '660f9511-f3ac-52e5-b841-678901bcdefg',
            name: 'Barba',
            description: 'Aparar e modelar barba',
            price: 30.0,
            duration: 30,
            establishmentId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            createdAt: '2023-10-27T11:00:00.000Z',
            updatedAt: '2023-10-27T11:00:00.000Z',
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      },
    }),
    ApiBadRequestResponse({
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
    ApiForbiddenResponse({
      description:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
          .description,
      schema: {
        example:
          SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
            .example,
      },
    }),
    ApiNotFoundResponse({
      description: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].description,
      schema: {
        example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].example,
      },
    }),
  );
}
