import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { MemberResponseDTO } from '../../members/dtos';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de busca de membro por ID
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /members/:memberId
 */
export function FindUserEstablishmentByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find establishment member by ID',
      description: 'Busca um membro específico do estabelecimento pelo ID.',
    }),
    ApiResponse({ status: 200, type: MemberResponseDTO }),
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
          {
            example:
              SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].example,
          },
        ],
      },
    }),
  );
}
