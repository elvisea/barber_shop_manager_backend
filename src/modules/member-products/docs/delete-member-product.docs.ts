import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de exclusão de produto de membro
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint DELETE /members/:memberId/products/:productId
 */
export function DeleteMemberProductDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a product assigned to a member in an establishment',
      description:
        'Exclui um produto específico atribuído a um membro em um estabelecimento.',
    }),
    ApiNoContentResponse({
      description: 'Produto excluído com sucesso',
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
            example: SwaggerErrors[ErrorCode.MEMBER_PRODUCT_NOT_FOUND].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND].example,
          },
        ],
      },
    }),
  );
}
