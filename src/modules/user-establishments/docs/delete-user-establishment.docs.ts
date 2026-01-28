import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de exclusão de membro de estabelecimento
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint DELETE /members/:memberId
 */
export function DeleteUserEstablishmentDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete establishment member',
      description:
        'Remove um membro do estabelecimento (soft delete). A relação UserEstablishment é marcada como deletada.',
    }),
    ApiResponse({ status: 204, description: 'Member deleted successfully' }),
    ApiNotFoundResponse({
      description: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].description,
      schema: {
        example: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].example,
      },
    }),
    ApiForbiddenResponse({
      description:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].description,
      schema: {
        oneOf: [
          {
            example:
              SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].example,
          },
        ],
      },
    }),
  );
}
