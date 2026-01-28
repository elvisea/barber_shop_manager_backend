import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { MemberResponseDTO } from '../../members/dtos';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de atualização de membro de estabelecimento
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint PATCH /members/:memberId
 */
export function UpdateUserEstablishmentDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update establishment member',
      description: 'Atualiza informações de um membro do estabelecimento.',
    }),
    ApiResponse({ status: 200, type: MemberResponseDTO }),
    ApiConflictResponse({
      description:
        SwaggerErrors[ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS].description,
      schema: {
        example: SwaggerErrors[ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS].example,
      },
    }),
    ApiConflictResponse({
      description:
        SwaggerErrors[ErrorCode.MEMBER_PHONE_ALREADY_EXISTS].description,
      schema: {
        example: SwaggerErrors[ErrorCode.MEMBER_PHONE_ALREADY_EXISTS].example,
      },
    }),
    ApiNotFoundResponse({
      description: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].description,
      schema: {
        example: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].example,
      },
    }),
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
