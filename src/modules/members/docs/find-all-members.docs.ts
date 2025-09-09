import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { MemberPaginatedResponseDTO } from '../dtos';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de listagem de membros
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /establishments/:establishmentId/members
 */
export function FindAllMembersDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find all members with pagination' }),
    ApiResponse({ status: 200, type: MemberPaginatedResponseDTO }),
    ApiNotFoundResponse({
      description: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].description,
      schema: {
        example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].example,
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
