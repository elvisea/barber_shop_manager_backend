import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { MemberPaginatedResponseDTO } from '../../members/dtos';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de listagem de membros de estabelecimento
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /establishments/:establishmentId/members
 */
export function FindAllUserEstablishmentsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find all establishment members with pagination',
      description:
        'Lista todos os membros (usuários) vinculados ao estabelecimento com paginação.',
    }),
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
