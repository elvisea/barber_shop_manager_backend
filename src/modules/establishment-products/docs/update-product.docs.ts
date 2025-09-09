import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { EstablishmentProductCreateResponseDTO } from '../dtos/establishment-product-create-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de atualização de produto
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint PATCH /establishments/:establishmentId/products/:productId
 */
export function UpdateProductDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update product by ID',
      description:
        'Atualiza um produto específico de um estabelecimento pelo ID.',
    }),
    ApiResponse({
      status: 200,
      description: 'Produto atualizado com sucesso',
      type: EstablishmentProductCreateResponseDTO,
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Shampoo Atualizado',
        description: 'Shampoo para cabelos oleosos - versão melhorada',
        price: 30.0,
        imageUrl: 'http://example.com/shampoo-updated.jpg',
        establishmentId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        createdAt: '2023-10-27T10:00:00.000Z',
        updatedAt: '2023-10-27T11:30:00.000Z',
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
    ApiConflictResponse({
      description:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_PRODUCT_NAME_ALREADY_EXISTS]
          .description,
      schema: {
        example:
          SwaggerErrors[ErrorCode.ESTABLISHMENT_PRODUCT_NAME_ALREADY_EXISTS]
            .example,
      },
    }),
  );
}
