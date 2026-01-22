import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { EstablishmentProductFindAllResponseDTO } from '../dtos/establishment-product-find-all-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { getPastDate } from '@/common/utils/date-helpers';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de busca de todos os produtos
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /establishments/:establishmentId/products
 */
export function FindAllProductsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Find all products (paginated)',
      description:
        'Busca todos os produtos de um estabelecimento com paginação.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de produtos encontrada com sucesso',
      type: EstablishmentProductFindAllResponseDTO,
      example: {
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Shampoo',
            description: 'Shampoo para cabelos oleosos',
            price: 25.5,
            imageUrl: 'http://example.com/shampoo.jpg',
            establishmentId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            createdAt: getPastDate(1),
            updatedAt: getPastDate(1),
          },
          {
            id: '660f9511-f3ac-52e5-b841-678901bcdefg',
            name: 'Condicionador',
            description: 'Condicionador para cabelos secos',
            price: 30.0,
            imageUrl: 'http://example.com/condicionador.jpg',
            establishmentId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            createdAt: getPastDate(0),
            updatedAt: getPastDate(0),
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
  );
}
