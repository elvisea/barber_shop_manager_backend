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

import { MemberProductCreateResponseDTO } from '../dtos/member-product-create-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { getCurrentDate } from '@/common/utils/date-helpers';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de associação de produto a membro
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /establishments/:establishmentId/members/:memberId/products/:productId
 */
export function CreateMemberProductDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Assign a product to a member in an establishment',
      description:
        'Associa um produto a um membro em um estabelecimento específico.',
    }),
    ApiResponse({
      status: 201,
      description: 'Produto associado ao membro com sucesso',
      type: MemberProductCreateResponseDTO,
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        memberId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        productId: 'b2c3d4e5-f6g7-8901-2345-678901bcdefg',
        price: 25.5,
        commission: 2.55,
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate(),
      },
    }),
    ApiBadRequestResponse({
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: {
        oneOf: [
          {
            example:
              SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.USER_NOT_MEMBER_OF_ESTABLISHMENT].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
                .example,
          },
        ],
      },
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
      schema: {
        oneOf: [
          {
            example:
              SwaggerErrors[ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND].example,
          },
        ],
      },
    }),
    ApiConflictResponse({
      description:
        SwaggerErrors[ErrorCode.MEMBER_PRODUCT_ALREADY_EXISTS].description,
      schema: {
        example: SwaggerErrors[ErrorCode.MEMBER_PRODUCT_ALREADY_EXISTS].example,
      },
    }),
  );
}
