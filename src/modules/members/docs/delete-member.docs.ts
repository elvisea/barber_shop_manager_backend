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
 * Documentação completa do endpoint de exclusão de membro
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint DELETE /establishments/:establishmentId/members/:memberId
 */
export function DeleteMemberDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete member' }),
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
