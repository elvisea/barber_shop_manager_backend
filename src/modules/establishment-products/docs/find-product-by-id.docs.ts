import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { EstablishmentProductCreateResponseDTO } from '../dtos/establishment-product-create-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { getCurrentDate } from '@/common/utils/date-helpers';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de busca de produto por ID
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /establishments/:establishmentId/products/:productId
 */
export function FindProductByIdDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Find product by ID',
      description: 'Busca um produto específico de um estabelecimento pelo ID.',
    }),
    ApiResponse({
      status: 200,
      description: 'Produto encontrado com sucesso',
      type: EstablishmentProductCreateResponseDTO,
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Shampoo',
        description: 'Shampoo para cabelos oleosos',
        price: 25.5,
        imageUrl: 'http://example.com/shampoo.jpg',
        establishmentId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate(),
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
      description:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND].description,
      schema: {
        example:
          SwaggerErrors[ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND].example,
      },
    }),
  );
}
